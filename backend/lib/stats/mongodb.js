/* global emit: true */
var Promise = require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var config = require('../../config');

var client;
function saveClient(refDb) {
    client = refDb;
    return client;
}

function  closeClient() {
    if (client) {
        client.close();
    }
}

function extractSimulationDailyCount(db, fromDate, toDate) {
    return db.collection('situations').mapReduce(function() {
        emit(this.dateDeValeur.toISOString().slice(0,10), 1);
    }, function(date, values) {
        return Array.sum(values);
    }, {
        out: {
            inline: 1,
        },
        query: {
            dateDeValeur: {
                $gte: fromDate,
                $lte: toDate,
            },
            modifiedFrom: {
                $exists: false,
            },
        },
    })
        .then(r => r.results || r)
        .then(formatMongo);
}

function formatMongo(data) {
    return [{
        metric: 'simulation',
        datapoints: data.map(function(dateTuple) {
            return {
                date: dateTuple._id,
                value: dateTuple.value,
            };
        }),
    }];
}

function extractSurveySummary(db) {
    return db.collection('followups').mapReduce(function() {
        var m = {
            asked: 1,
            failed: 2,
            nothing: 3,
            already: 4,
        };
        if(this.surveys[0].answers.length) {
            this.surveys[0].answers.sort(function(a,b) { return m[a.value] > m[b.value]; });
            emit(this.surveys[0].answers[0].value,1);
        }
    }, function(k,v) {
        return Array.sum(v);
    },
    {
        query:{
            'surveys.type': 'initial',
            'surveys.repliedAt': {$exists: true},
        },
        out: {inline: 1}
    })
        .then(r => r.results || r)
        .then(summary => summary.reduce((set, row) => {
            set[row._id] = row.value;
            set.total += row.value;

            return set;
        }, { total: 0 }));
}

function extractSurveyDetails(db) {
    return db.collection('followups').mapReduce(function() {
        var obj = {};
        this.benefits.forEach(function(b) {
            obj[b.id] = b.amount;
        });
        this.surveys[0].answers.forEach(function(a) {
            emit(a.id + ";" + a.value, 1);
        });
    }, function(k,v) {
        return Array.sum(v);
    },
    { query:{
        'surveys.type': 'initial',
        'surveys.repliedAt': {$exists: true},
    },
    out: {inline: 1}})
        .then(r => r.results || r)
        .then(results => {
            var groupMap = results.reduce(function(total, p) {
                var fields = p._id.split(';');
                var id = fields[0];
                var state = fields[1];
                total[id] = total[id] || { total: 0};
                total[id][state] = p.value;
                total[id].total += p.value;
                return total;
            }, {});

            var groups = Object.keys(groupMap).map(g => {
                return Object.assign({ id: g}, groupMap[g]);
            });

            groups.sort(function(a, b) { return a.total < b.total ? 1 : -1; });

            return groups;
        });
}

function manageMissingDBOrCollection(error) {
    console.log(error);
    if ((error.message == 'ns doesn\'t exist') || error.message.match('does not exist')) {
        return {
            dailySituationCount: [],
            survey: {
                summary: [],
                details: []
            }
        };
    } else {
        throw error;
    }
}

function connect() {
    return MongoClient
        .connectAsync(config.mongo.uri, config.mongo.options)
        .then(saveClient)
        .then(client => client.db());
}
exports.connect = connect;

exports.getStats = function(fromDate, toDate) {
    return connect()
        .then(function(db) {
            // MongoDB 2.4 (production) does not embed metadata of the operation, the result is directly available in the response
            // MongoDB 3.4 (dev environment) returns results with metadata and are available in the results property
            return extractSimulationDailyCount(db, fromDate, toDate)
                .then(dailies => {
                    return extractSurveySummary(db)
                        .then(summary => {
                            return extractSurveyDetails(db)
                                .then(details => {
                                    return {
                                        dailySituationCount: dailies,
                                        survey: {
                                            summary,
                                            details
                                        }
                                    };
                                });
                        });
                });
        })
        .catch(manageMissingDBOrCollection)
        .finally(result => {
            closeClient()
            return result
        })
};

exports.closeClient = closeClient;
