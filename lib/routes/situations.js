var situations = require('../controllers/situations');

module.exports = function(api) {

    /*
    ** Param injection
    */
    api.param('situationId', situations.situation);

    /*
    ** Routes
    */
    api.route('/situations/:situationId')
        .get(situations.show)
        .put(situations.update);

    api.route('/situations/:situationId/submit').post(situations.submit);

    api.route('/situations').post(situations.create);

    api.route('/situations/:situationId/simulation').get(situations.simulation);

    api.route('/situations/:situationId/openfisca-response').get(situations.openfiscaResponse);

    api.route('/situations/:situationId/openfisca-request').get(situations.openfiscaRequest);

    api.route('/situations/:situationId/cerfa/:cerfaId').get(situations.cmuCerfa);

};
