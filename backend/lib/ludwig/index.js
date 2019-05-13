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
                    if (err) {
                        // En cas d'erreur, Ludwig n'enregistre pas le test en échec. Hack...
                        var falseResults = acceptanceTest.expectedResults.reduce(function(accum, tuple) {
                            accum[tuple.code] = (- tuple.expectedValue) || true;

                            return accum;
                        }, {});

                        return done(null, falseResults);
                    }

                    return done(err, result && extractResults(result, situation.dateDeValeur));
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
