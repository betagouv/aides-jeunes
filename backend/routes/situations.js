var situations = require('../controllers/situations');

module.exports = function(api) {

    /*
    ** Param injection
    */
    api.param('situationId', situations.situation);
    api.route('/situations/:situationId').get(situations.show);
    api.route('/situations').post(situations.create);

    api.route('/situations/:situationId/openfisca-response').get(situations.openfiscaResponse);
    api.route('/situations/:situationId/openfisca-request').get(situations.openfiscaRequest);
};
