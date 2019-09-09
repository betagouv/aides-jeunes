const Sentry = require('@sentry/browser');
const Integrations = require('@sentry/integrations');

const whitelistUrls = [];
if (process.env.NODE_ENV === 'production') {
    whitelistUrls.push(/mes-aides\.gouv\.fr/);
}

Sentry.init({
    dsn: 'https://fde1d4c9741e4ef3a3416e4e88b61392@sentry.data.gouv.fr/17',
    // @see https://docs.sentry.io/platforms/javascript/angular/
    integrations: [
        new Integrations.Angular(),
    ],
    whitelistUrls: whitelistUrls,
    blacklistUrls: [
        /^file:\/\//i
    ],
});
