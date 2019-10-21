var followups = require('../controllers/followups');

module.exports = function(api) {
    api.route('/followups/surveys/:surveyId').get(followups.showFromSurvey);
    api.route('/followups/surveys/:surveyId/answers').post(followups.postSurvey);
};
