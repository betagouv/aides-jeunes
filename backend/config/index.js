/* eslint-disable no-console */
var env = process.env.NODE_ENV || 'development';

var all = {
    env: env,
    animation: {
        delay: process.env.ANIMATION_DELAY || 300,
    },
    baseURL: 'https://mes-aides.org',
    openfiscaURL: process.env.OPENFISCA_URL || 'http://localhost:2000',
    openfiscaAxeURL: 'https://betagouv.github.io/mes-aides-changent',
    openfiscaPublicURL: 'https://openfisca.mes-aides.org',
    openfiscaTracerURL: 'https://openfisca.github.io/tracer',
    sendInBlue: {
        apiKey: process.env.SEND_IN_BLUE_PRIVATE_KEY || 'privateKey',
    },
    matomo: {
        id: 165,
    },
    mongo: {
        uri: process.env.MONGODB_URL || 'mongodb://localhost/dds',
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    },
    sessionSecret: process.env.SESSION_SECRET || 'fghjdfjkdf785a-jreu',
};

var override = {};
try
{
    override = require('./' + env);
    console.info('Using specific configuration for ' + env + '.');
} catch (e) {
    console.warn('No specific configuration for ' + env + '.');
}

module.exports = Object.assign(all, override);
