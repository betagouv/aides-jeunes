var express = require('express');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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
require('ludwig-ui')(app, path.join(__dirname, 'app/js/directives/tests/scenario.js'), '/tests');
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
