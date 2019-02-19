var Raven = require('raven-js');

var sentry = {
    publicDsn: 'https://fde1d4c9741e4ef3a3416e4e88b61392@sentry.data.gouv.fr/17',
    frontOptions: {
        whitelistUrls: [
            /mes-aides\.gouv\.fr/
        ],
        ignoreUrls: [
            /^file:\/\//i
        ]
    }
};

Raven
    .config(sentry.publicDsn, sentry.frontOptions)
    .addPlugin(require('raven-js/plugins/angular'), window.angular)
    .install();
