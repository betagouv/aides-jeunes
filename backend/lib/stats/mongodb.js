/* global emit: true */
var Promise = require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var config = require('../../config');

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

function manageMissingDBOrCollection(error) {
    if ((error.message == 'ns doesn\'t exist') || error.message.match('does not exist')) {
        return { results: [] };
    } else {
        throw error;
    }
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
        .connectAsync(config.mongo.uri)
        .then(saveDb)
        .then(function(db) { return extractSimulationDailyCount(db, fromDate, toDate); })
        .catch(manageMissingDBOrCollection)
    // MongoDB 2.4 (production) does not embed metadata of the operation, the result is directly available in the response
    // MongoDB 3.4 (dev environment) returns results with metadata and are available in the results property
        .then(function(response) { return response.results || response; })
        .then(formatMongo);
};

exports.closeDb = function() {
    if (db) {
        db.close();
    }
};
