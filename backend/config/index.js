/* eslint-disable no-console */
var env = process.env.NODE_ENV || 'development';

var all = {
    env: env,
    baseURL: 'https://mes-aides.org',
    openfiscaURL: process.env.OPENFISCA_URL || 'http://localhost:2000',
    openfiscaAxeURL: 'https://betagouv.github.io/mes-aides-changent',
    openfiscaPublicURL: 'https://openfisca.mes-aides.org',
    openfiscaTracerURL: 'https://betagouv.github.io/openfisca-tracer',
    sendInBlue: {
        apiKey: process.env.SEND_IN_BLUE_PRIVATE_KEY || 'privateKey',
    },
    mongo: {
        uri: process.env.MONGODB_URL || 'mongodb://localhost/dds',
    },
    sessionSecret: process.env.SESSION_SECRET || 'fghjdfjkdf785a-jreu',
};

var override = {};
try
{
    override = require('./' + env);
    console.info('Using specific configuration for ' + env + '.');
} catch (e) {
    if (e.toString().match(/Cannot find module/) && !env.match(/production/)) {
        console.warn('No specific configuration for ' + env + '.');
    } else {
        throw e;
    }
}

module.exports = Object.assign(all, override);
