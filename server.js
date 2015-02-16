var express = require('express');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var ludwigConfig = require('./ludwig.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

ludwigConfig.serverConfig = { mesAidesRootUrl: process.env.MES_AIDES_ROOT_URL || 'http://localhost:9000' };

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
app.use('/api', require('sgmap-mes-aides-api'));
require('ludwig-ui')(app, __dirname, ludwigConfig);
require('./')(app);

if ('development' === env) {
    app.use(errorHandler());
}

var port = process.env.PORT || 9000;

// Start server
app.listen(port, function () {
    console.log('Express server listening on port %d, in %s mode', port, app.get('env'));
});

exports = module.exports = app;
