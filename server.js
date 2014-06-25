var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var errorHandler = require('errorhandler');
var morgan = require('morgan');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

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
