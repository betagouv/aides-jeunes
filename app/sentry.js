var Raven = require('raven-js');

Raven
    .config('https://fde1d4c9741e4ef3a3416e4e88b61392@sentry.data.gouv.fr/17', {
        whitelistUrls: [
            /mes-aides\.gouv\.fr/
        ],
        ignoreUrls: [
            /^file:\/\//i
        ]
    })
    .addPlugin(require('raven-js/plugins/angular'), window.angular)
    .install();
