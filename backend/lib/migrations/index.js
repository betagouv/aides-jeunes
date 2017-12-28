var es = require('event-stream');

// Loads
require('../../../backend');
require('expect');
var mongoose = require('mongoose');

// Setup mongoose
var Situation = mongoose.model('Situation');


var BATCH_SIZE = 50000;
var startDate = (new Date()).toISOString();
var errors = 0;
var counter = 0;

function migrateAllSituations(migration) {
    Situation.find({ version: (migration.version - 1) }).sort({ dateDeValeur: -1 }).limit(BATCH_SIZE).cursor()
    .pipe(es.map(function (situation, done) {
        migration.function(situation);
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
        console.log(['Terminé', migration.version, startDate, (new Date()).toISOString(), BATCH_SIZE, counter, errors].join(';'));
        process.exit();
    })
    .on('error', function(err) {
        console.trace(err);
        process.exit();
    })
    .resume();
}

var migration = process.argv[process.argv.length - 1];
migrateAllSituations(require('./' + migration));
