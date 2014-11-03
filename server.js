var express = require('express');
var errorHandler = require('errorhandler');
var morgan = require('morgan');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');

// Setup Express
var app = express();
var env = app.get('env');

if ('development' === env) {
    app.use(morgan('dev'));
}

if ('production' === env) {
    app.use(morgan());
}

// prerender.io
app.use(require('prerender-node').set('prerenderToken', 'JAGCiJMW0f0sBOL7PWgs'));

// Setup app
app.use('/api', require('sgmap-mes-aides-api'));
require('./lib/config/client')(app, config);

if ('development' === env) {
    app.use(errorHandler());
}

// Start server
app.listen(config.port, config.ip, function () {
    console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

exports = module.exports = app;
