var acceptanceTests = require('../controllers/acceptanceTests');

module.exports = function(api) {

    /*
    ** Routes
    */
    api.route('/acceptance-tests')
        .get(acceptanceTests.list)
        .post(acceptanceTests.create);

};
