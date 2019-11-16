var benefits = require('../controllers/benefits');
var cors = require('cors');

module.exports = function(api) {
    api.route('/benefits').get( cors({ origin: '*' }), benefits.list);
};
