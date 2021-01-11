var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');

var followups = require('../controllers/followups');
var situations = require('../controllers/situations');
var teleservices = require('../controllers/teleservices');

module.exports = function(api) {
    api.route('/situations').post(cookieParser(), situations.create);

    var route = new express.Router({ mergeParams: true });
    route.use(cookieParser());
    route.use(situations.validateAccess);

    route.get('/', situations.show);
    route.get('/openfisca-response', situations.openfiscaResponse);
    route.get('/legacy-openfisca-request', situations.openfiscaRequestFromLegacy);

    // Enable CORS for openfisca-tracer
    route.options('/openfisca-request', cors());
    route.get('/openfisca-request', cors({ origin: '*' }), situations.openfiscaRequest);

    route.post('/openfisca-test', situations.openfiscaTest);
    route.get('/openfisca-trace', situations.openfiscaTrace);

    route.post('/followup', followups.persist);

    teleservices.names.forEach(function(name) {
        route.get('/' + name,
            teleservices.metadataResponseGenerator(teleservices[name])
        );
    });

    api.options('/situations/via/:signedPayload', cors());
    api.get('/situations/via/:signedPayload',
        cors({ origin: '*' }),
        teleservices.checkCredentials,
        teleservices.attachPayloadSituation,
        teleservices.verifyRequest,
        teleservices.exportRepresentation);
    api.use('/situations/:situationId', route);

    /*
    ** Param injection
    */
    api.param('situationId', situations.situation);
    api.param('signedPayload', teleservices.decodePayload);
};
