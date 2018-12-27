var Raven = require('raven-js');
var config = require('../backend/config/sentry');

Raven
    .config(config.publicDsn, config.frontOptions)
    .addPlugin(require('raven-js/plugins/angular'), window.angular)
    .install();
