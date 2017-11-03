/* global emit: true */
var Promise = require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);

var db;
function saveDb(refDb) {
    db = refDb;
    return db;
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
    });
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

exports.getDailySituationCount = function(fromDate, toDate) {
    return MongoClient
    .connectAsync('mongodb://localhost:27017/dds')
    .then(saveDb)
    .then(function(db) { return extractSimulationDailyCount(db, fromDate, toDate); })
    .then(function(response) { return response.results; })
    .then(formatMongo);
};

exports.closeDb = function() {
    if (db) {
        db.close();
    }
};
