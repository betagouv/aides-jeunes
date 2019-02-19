var parameters = require('../controllers/parameters');

module.exports = function(api) {

    api.route('/parameters/:parameterId').get(parameters.show);

};
