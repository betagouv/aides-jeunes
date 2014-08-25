'use strict';

module.exports = {
    env: 'development',
    mongo: {
        uri: process.env.MONGOHQ_URL ||
            'mongodb://localhost/dds-dev'
    },
    cerfaFormFillerApi: 'http://localhost:9001'
};
