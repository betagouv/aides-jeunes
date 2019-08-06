#!/usr/bin/env node

var express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;

require('./backend');
var Followup = require('mongoose').model('Followup');
var render = require('./backend/lib/mes-aides/emails/initial').render;

var port = process.env.PORT || 9001;

// Setup Express
var app = express();

app.route('/mjml/:situation').get(function(req, res) {
    Followup
        .findOne({ situation: ObjectId(req.params.situation) })
        .populate('situation')
        .exec(function(err, followup) {
            render(followup).then(function(result) {
                res.send(result.html);
            });
        });
});

// Start server
app.listen(port, function () {
    console.log('Mes Aides MJML preview server listening on port %d, in %s mode', port, app.get('env'));
});

module.exports = app;
