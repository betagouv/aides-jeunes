'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
    root: rootPath,
    ip: '0.0.0.0',
    port: process.env.PORT || 9000,
    sessionSecret: 'blablablabla',
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },
    openfiscaApi: process.env.OPENFISCA_URL ||
                  'http://openfisca-api.herokuapp.com',
    cerfaFormFillerApi: process.env.CERFA_FORM_FILLER_URL ||
                  'https://sgmap-dds-cerfa-form-filler.herokuapp.com'
};
