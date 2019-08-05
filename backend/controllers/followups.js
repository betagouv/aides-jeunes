var mailjet = require('node-mailjet');
var Followup = require('mongoose').model('Followup');

var config = require('../config');
var sender = mailjet.connect(config.mailjet.publicKey, config.mailjet.privateKey);
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

function sendEmail(followup, email) {
    email = email || followup.email;

    return followup.renderInitial()
        .then(render => {
            return sender.post('send', { version: 'v3.1' })
                .request({ Messages: [{
                    From: { Name: 'Équipe Mes Aides', Email: 'contact@mes-aides.gouv.fr'},
                    To: [{ Email: email}],
                    Subject: render.subject,
                    TextPart: render.text,
                }]});
        }).then(() => {
            followup.sentAt = new Date();
            followup.email = undefined;

            return followup.save();
        }).catch(err => {
            console.error(err);
            followup.email = email;
            return followup.save();
        });
}
exports.sendEmail = sendEmail;

exports.persistAndSendEmail = function(req, res) {
    if (! req.body.email || ! req.body.email.length) {
        return res.status(400).send({ result: 'KO' });
    }

    Followup.create({
        situation: req.situation
    }).then(followup => {
        return sendEmail(followup, req.body.email)
            .then(() => res.send({ result: 'OK' }));
    }).catch(error => {
        console.error('error', error);
        return res.status(400).send({ result: 'KO' });
    });
};
