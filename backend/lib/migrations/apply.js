var es = require('event-stream');

// Loads
require('../../../backend');
require('expect');
var mongoose = require('mongoose');
var migrations = require('.');

// Setup mongoose
var Situation = mongoose.model('Situation');

var counter = 0;
var errors = 0;
var limit = 50000;
var startDate = (new Date()).toISOString();

function migrateAllSituations() {
    Situation.find({ version: { $ne: migrations.list.length }}).sort({ dateDeValeur: -1 }).limit(limit).cursor()
    .pipe(es.map(function (situation, done) {
        migrations.apply(situation);
        situation.save(function (err) {
            if (err) {
                console.log('Cannot save migrated situation %s', situation.id);
                console.trace(err);
                errors = errors + 1;
            }
            counter = counter + 1;
            done();
        });
    }))
    .on('end', function() {
        console.log(['Terminé', migrations.list.length, startDate, (new Date()).toISOString(), counter, errors].join(';'));
        process.exit();
    })
    .on('error', function(err) {
        console.trace(err);
        process.exit();
    })
    .resume();
}

migrateAllSituations();
