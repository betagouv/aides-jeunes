var env = process.env.NODE_ENV || 'development';

var all = {
    openfiscaApi: process.env.OPENFISCA_URL || 'http://localhost:2000',
    sessionSecret: process.env.SESSION_SECRET || 'fghjdfjkdf785a-jreu',
    mongo: {
        uri: process.env.MONGODB_URL || 'mongodb://localhost/dds',
        options: {
            useMongoClient: true,
        },
    }
};

var override = {};
try
{
    override = require('./' + env);
} catch (e) {
    console.warn('No specific configuration for ' + env + '.');
}

module.exports = Object.assign(all, override);
