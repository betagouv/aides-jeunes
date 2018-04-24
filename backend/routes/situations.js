var express = require('express');

var situations = require('../controllers/situations');

module.exports = function(api) {
    api.route('/situations').post(situations.create);

    var route = new express.Router({ mergeParams: true });
    route.use(situations.validateAccess);

    route.get('/', situations.show);
    route.get('/openfisca-response', situations.openfiscaResponse);
    route.get('/legacy-openfisca-request', situations.openfiscaRequestFromLegacy);
    route.get('/openfisca-request', situations.openfiscaRequest);
    route.post('/openfisca-test', situations.openfiscaTest);
    route.get('/openfisca-trace', situations.openfiscaTrace);

    api.use('/situations/:situationId', route);

    /*
    ** Param injection
    */
    api.param('situationId', situations.situation);
};
