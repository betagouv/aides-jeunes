var Followup = require('mongoose').model('Followup');

var situation = require('./situations');

exports.followup = function(req, res, next, id) {
    Followup.findById(id).populate('situation').exec(function(err, followup) {
        if (err) return next(err);
        if (! followup || ! followup.situation || ! followup.situation._id) return res.redirect('/');
        req.followup = followup;

        situation.situation(req, res, next, followup.situation);
    });
};

exports.resultRedirect = function(req, res) {
    situation.attachAccessCookie(req, res);
    res.redirect(req.situation.returnPath);
};

exports.persist = function(req, res) {
    if (! req.body.email || ! req.body.email.length) {
        return res.status(400).send({ result: 'KO' });
    }

    Followup.create({
        situation: req.situation,
        email: req.body.email,
        surveyOptin: req.body.surveyOptin,
    }).then(followup => {
        return followup.sendInitialEmail();
    }).then(() => {
        return res.send({ result: 'OK' });
    }).catch(error => {
        console.error('error', error);
        return res.status(400).send({ result: 'KO' });
    });
};

exports.showFromSurvey = function(req, res) {
    Followup.findOne({
        'surveys._id': req.params.surveyId
    }).then((followup) => {
        if (! followup) return res.sendStatus(404);

        res.send(followup);
    });
};

exports.postSurvey = function(req, res) {
    Followup.findOne({
        'surveys._id': req.params.surveyId
    }).then((followup) => {
        if (! followup) return res.sendStatus(404);

        followup.updateSurvey(req.params.surveyId, req.body)
            .then(() => {
                res.sendStatus(201);
            });
    });
};
