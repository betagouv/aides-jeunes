'use strict';

module.exports = {
    baseURL: 'http://localhost:9000',
    openfiscaPublicURL: 'http://localhost:2000',
    openfiscaTracerURL: 'http://localhost:3000',
    teleserviceAccessTokens: {
        loiret_APA_test: 'token',
        loiret_APA: 'token',
    },
    mailjet: {
        publicKey: '7d099a10cbab14c68eb43bccff86c5bd',
        privateKey: process.env.MAILJET_PRIVATE_KEY,
    },
};
