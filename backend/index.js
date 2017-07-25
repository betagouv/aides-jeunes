var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var ludwigApi = require('ludwig-api');
var reverseMap = function() { return { calculatedPrestations: {} }; }; //require('./lib/simulation/openfisca/mapping/reverse');

// Setup mongoose
require('./config/mongoose')(mongoose, config);

// Setup Express
var app = express();

// Mount Ludwig API
var Situation = mongoose.model('Situation');

app.use(ludwigApi({

    mongoose: mongoose,

    possibleValues: require('../ludwig/api-config'),

    simulate: function (acceptanceTest, done) {
        Situation.findById(acceptanceTest.scenario.situationId).exec(function (err, situation) {
            if (err) return done(err);
            if (!situation) return done(new Error('Situation not found'));
            situation.simulate(function(err, result) {
                return done(err, result && reverseMap(result, situation).calculatedPrestations);
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

}));

// Setup api
app.use(require('./config/api'));

module.exports = app;
