var es = require('event-stream');

// Loads
require('../../../backend');
require('expect');
var mongoose = require('mongoose');
var migrations = require('.');

// Setup mongoose
var Situation = mongoose.model('Situation');

var startDate = (new Date()).toISOString();
var errors = 0;
var counter = 0;

function migrateAllSituations() {
    Situation.find({ version: { $ne: migrations.list.length }}).sort({ dateDeValeur: -1 }).cursor()
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
        console.log(['Terminé', startDate, (new Date()).toISOString(), counter, errors].join(';'));
        process.exit();
    })
    .on('error', function(err) {
        console.trace(err);
        process.exit();
    })
    .resume();
}

migrateAllSituations();
