var es = require('event-stream');

// Loads
require('../../../backend');
require('expect');
var mongoose = require('mongoose');

// Setup mongoose
var Situation = mongoose.model('Situation');

function migrateAllSituations(migrationFunction) {
    Situation.find({ status: 'test' }).stream()
        .pipe(es.map(function (situation, done) {
            var isSituationUpdated = migrationFunction(situation);
            situation.save(function (err) {
                if (err) {
                    console.log('Cannot save migrated situation %s', situation.id);
                    console.trace(err);
                }
                else if (isSituationUpdated)
                    console.log('Situation ' + situation._id + ' migrated');
                done();
            });

            done();
        }))
        .on('end', function() {
            console.log('Terminé');
            process.exit();
        })
        .on('error', function(err) {
            console.trace(err);
            process.exit();
        })
        .resume();
}

module.exports = {
    migrateAllSituations: migrateAllSituations,
};
