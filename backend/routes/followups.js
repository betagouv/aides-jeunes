var followups = require('../controllers/followups');

module.exports = function(api) {
    api.use('/followups/:followupId', followups.resultRedirect);
    api.param('followupId', followups.followup);
};
