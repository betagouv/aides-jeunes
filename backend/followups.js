var express = require('express');
var followups = require('./controllers/followups');

// Setup Express
var app = express();

var router = new express.Router();

router.param('followupId', followups.followup);
router.get('/:followupId', followups.resultRedirect);

app.use(router);

module.exports = app;
