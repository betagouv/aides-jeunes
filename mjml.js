#!/usr/bin/env node

var express = require('express');

require('./backend');
var Situation = require('mongoose').model('Situation');

var openfisca = require('./backend/lib/openfisca');
var renderAsHtml = require('./backend/lib/mes-aides/emails').renderAsHtml;
var computeAides = require('./backend/lib/mes-aides').computeAides;

var port = process.env.PORT || 9001;

// Setup Express
var app = express();

app.route('/mjml/:situation').get(function(req, res) {
    Situation.findById(req.params.situation, function(err, situation) {
        openfisca.calculate(situation, function(err, openfiscaResponse) {
            var benefits = computeAides(situation, openfiscaResponse, false);
            renderAsHtml(benefits)
                .then(function(html) { res.send(html); });
        });
    });
});

// Start server
app.listen(port, function () {
    console.log('Mes Aides MJML preview server listening on port %d, in %s mode', port, app.get('env'));
});

module.exports = app;
