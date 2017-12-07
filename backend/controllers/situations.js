var openfisca = require('../lib/openfisca');
var Situation = require('mongoose').model('Situation');

exports.situation = function(req, res, next, id) {
    Situation.findById(id, function(err, situation) {
        if (err) return next(err);
        if (! situation) return res.sendStatus(404);

        req.situation = situation;
        next();
    });
};

exports.show = function(req, res) {
    res.send(req.situation);
};

exports.create = function(req, res, next) {
    if (req.body._id) return res.status(403).send({ error: 'You can‘t provide _id when saving a situation. _id will be generated automatically.' });

    return Situation.create(req.body, function(err, persistedSituation) {
        if (err) return next(err);

        res.send(persistedSituation);
    });
};

exports.openfiscaResponse = function(req, res, next) {
    return openfisca.calculate(req.situation, function(err, result) {
        if (err) return next(Object.assign(err, { _id: req.situation._id }));

        res.send(Object.assign(result, { _id: req.situation._id }));
    });
};

exports.openfiscaTrace = function(req, res, next) {
    return openfisca.trace(req.situation, function(err, result) {
        if (err) return next(Object.assign(err, { _id: req.situation._id }));

        res.send(Object.assign(result, { _id: req.situation._id }));
    });
};

exports.openfiscaRequest = function(req, res) {
    res.send(openfisca.buildOpenFiscaRequest(req.situation));
};

exports.openfiscaRequestFromLegacy = function(req, res) {
    res.send(openfisca.buildOpenFiscaRequestFromLegacySituation(req.situation));
};
