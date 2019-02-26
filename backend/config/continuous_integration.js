'use strict';

module.exports = Object.assign(require('./development'), {
    sentry: {
        privateDsn: 'https://userID:password@ci.sentry.data.gouv.fr/17'
    },
});
