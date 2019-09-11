var followups = require('../controllers/followups');

module.exports = function(api) {
    api.route('/followups/:followupId').get(followups.show);
    api.route('/followups/:followupId/surveys').post(followups.postSurvey);
};
