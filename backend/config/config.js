module.exports = {
    openfiscaApi: process.env.OPENFISCA_URL || 'http://localhost:2000',
    sessionSecret: process.env.SESSION_SECRET || 'fghjdfjkdf785a-jreu',
    mongo: {
        uri: process.env.MONGODB_URL || 'mongodb://localhost/dds'
    }
};
