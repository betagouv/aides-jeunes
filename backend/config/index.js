var env = process.env.NODE_ENV || 'development';

var all = {
    env: env,
    baseURL: 'https://mes-aides.gouv.fr',
    openfiscaURL: process.env.OPENFISCA_URL || 'http://localhost:2000',
    openfiscaPublicURL: 'https://openfisca.mes-aides.gouv.fr',
    openfiscaTracerURL: 'https://betagouv.github.io/openfisca-tracer',
    mongo: {
        uri: process.env.MONGODB_URL || 'mongodb://localhost/dds',
        options: {
            useMongoClient: true,
        },
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
