var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

// Setup mongoose
require('./config/mongoose')(mongoose, config);

// Setup Express
var app = express();

if (config.env.match(/production/) || (config.sentry && config.sentry.privateDsn)) {
    if ((! config.sentry) || (! config.sentry.privateDsn)) {
        throw new Error('Sentry monitoring in production is mandatory. Missing configuration details! Aborting...');
    }
    var raven = require('raven');
    raven.config(config.sentry.privateDsn);
    var installedValuePreInstall = raven.installed;
    raven.install();
    var installedValuePostInstall = raven.installed;
    app.use(raven.requestHandler());

    // Ensure installed property exists and behaves as expected
    if (installedValuePreInstall || !installedValuePostInstall) {
        throw new Error('raven.installed does not behave as expected! Aborting...');
    }
}
app.use(require('./lib/ludwig')(mongoose, mongoose.model('Situation')));
app.use(require('./config/api'));

module.exports = app;
