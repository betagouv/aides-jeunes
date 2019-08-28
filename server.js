#!/usr/bin/env node

var express = require('express');
var morgan = require('morgan');
var ludwigConfig = require('./ludwig/ui-config');
var Sentry = require('@sentry/node');

var port = process.env.PORT || 9000;

ludwigConfig.mesAidesRootUrl = process.env.MES_AIDES_ROOT_URL || ('http://localhost:' + port);

Sentry.init({
    // Enable Sentry in production
    // https://docs.sentry.io/development/sdk-dev/overview/#usage-for-end-users
    dsn: process.env.NODE_ENV === 'production' ? 'https://fde1d4c9741e4ef3a3416e4e88b61392@sentry.data.gouv.fr/17' : null,
});

// Setup Express
var app = express();

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// Setup app
app.use('/api', require('./backend/api'));
app.use(ludwigConfig.baseUrl, require('ludwig-ui')(ludwigConfig));
app.use('/followups', require('./backend/followups'));

require('./index.js')(app);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

if (app.get('env') == 'development') {
    app.use(morgan('dev'));
    app.use(require('errorhandler')());
} else {
    app.use(morgan('combined'));
}

// Start server
app.listen(port, function () {
    console.log('Mes Aides server listening on port %d, in %s mode, expecting to be deployed on %s', port, app.get('env'), ludwigConfig.mesAidesRootUrl);
});

module.exports = app;
