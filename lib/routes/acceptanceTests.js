var acceptanceTests = require('../controllers/acceptanceTests');

module.exports = function(api) {

    /*
    ** Param injection
    */
    api.param('testId', acceptanceTests.find);

    /*
    ** Routes
    */
    api.route('/acceptance-tests')
        .get(acceptanceTests.list)
        .post(acceptanceTests.create);

    api.route('/acceptance-tests/:testId')
        .get(acceptanceTests.show)
        .put(acceptanceTests.update);

};
