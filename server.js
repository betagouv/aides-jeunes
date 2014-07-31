var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var errorHandler = require('errorhandler');
var morgan = require('morgan');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var openfisca = require('./lib/simulation/openfisca');

var config = require('./lib/config/config');

// Ping OpenFisca
openfisca.ping();
setInterval(openfisca.ping, 30*1000);

// Setup mongoose
require('./lib/config/mongoose')(mongoose, config);

// Setup Passport
require('./lib/config/passport')(passport);

// Setup Express
var app = express();
var env = app.get('env');

if ('development' === env) {
    app.use(morgan('dev'));
}

if ('production' === env) {
    app.use(morgan());
}

// Setup app
require('./lib/config/api')(app, passport, config);
require('./lib/config/client')(app, config);

if ('development' === env) {
    app.use(errorHandler());
}

// Start server
app.listen(config.port, config.ip, function () {
    console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

exports = module.exports = app;
