var extractResults = require('./extractResults');
var ludwigApi = require('ludwig-api');
var openfisca = require('../openfisca');

module.exports = function(mongoose, Situation) {
    return ludwigApi({
        mongoose: mongoose,
        possibleValues: require('./api-possible-values'),

        simulate: function (acceptanceTest, done) {
            Situation.findById(acceptanceTest.scenario.situationId).exec(function (err, situation) {
                if (err) return done(err);
                if (!situation) return done(new Error('Situation not found'));
                openfisca.calculate(situation, function(err, result) {
                    return done(err, result && extractResults(result));
                });
            });
        },

        onCreate: function (acceptanceTest, done) {
            var situationId = acceptanceTest.scenario.situationId;

            Situation.findById(situationId).exec(function (err, situation) {
                if (err) return done(err);
                if (!situation) return done(new Error('Situation not found'));
                situation.set('status', 'test');
                situation.save(done);
            });
        }
    });
};
