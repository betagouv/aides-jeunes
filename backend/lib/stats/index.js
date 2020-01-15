/* eslint-disable no-console */
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var piwik = require('./piwik');
var mongodb = require('./mongodb');

function dateDaysAgo(nb_days) {
    var date = new Date();
    date = new Date(date.toISOString().slice(0,10));
    date.setDate(date.getDate() - nb_days);
    return date;
}

var nineWeeksAgo = dateDaysAgo(7 * 9);
var yesterday = dateDaysAgo(1);
var today = dateDaysAgo(0);

var relative_path = __dirname + '/../../../dist/stats.json';
Promise.all([
    mongodb.getStats(nineWeeksAgo,today),
    piwik.getUsageData(nineWeeksAgo, yesterday)
])
    .then(function(data) {
        return {
            basic: [].concat(data[0].dailySituationCount, data[1]),
            survey: data[0].survey
        };
    })
    .then(function(data) { return fs.writeFileAsync(relative_path, JSON.stringify(data, null, 2), 'utf-8'); })
    .catch(function(error) {
        console.error('error', error);
        process.exitCode = 1;
    })
    .finally(mongodb.closeDb);
