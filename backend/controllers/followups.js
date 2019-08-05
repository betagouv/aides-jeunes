var Followup = require('mongoose').model('Followup');

exports.followup = function(req, res) {
    if (! req.body.email || ! req.body.email.length) {
        return res.status(400).send({ result: 'KO' });
    }

    Followup.create({
        email: req.body.email,
        situation: req.situation
    }, function(err) {
        if (err) {
            return res.status(400).send({ result: 'KO' });
        }
        res.send({ result: 'OK' });
    });
};
