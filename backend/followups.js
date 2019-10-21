var express = require('express');
var followups = require('./controllers/followups');

// Setup Express
var app = express();

var router = new express.Router();

router.param('followupId', followups.followup);
router.get('/:followupId', followups.resultRedirect);

if (app.get('env') === 'development') {
    router.get('/:followupId/initial.html', function(req, res) {
        req.followup.renderInitialEmail().then(render => res.send(render.html));
    });
    router.get('/:followupId/survey.html', function(req, res) {
        req.followup.renderSurveyEmail({returnPath: '/returnPath'}).then(render => res.send(render.html));
    });
}
app.use(router);

module.exports = app;
