var _ = require('lodash');
var openfisca = require('../lib/openfisca');
var openfiscaTest = require('../lib/openfisca/test');
var Situation = require('mongoose').model('Situation');

exports.situation = function(req, res, next, id) {
    Situation.findById(id, function(err, situation) {
        if (err) return next(err);
        if (! situation) return res.sendStatus(404);

        req.situation = situation;
        next();
    });
};

exports.validateAccess = function(req, res, next) {
    var situation = req.situation;
    if (req.situation.status === 'test' || !situation.token || req.cookies['situation_' + situation.id] === situation.token) return next();
    res.status(403).end();
};

exports.show = function(req, res) {
    res.send(req.situation);
};

exports.create = function(req, res, next) {
    if (req.body._id) return res.status(403).send({ error: 'You can‘t provide _id when saving a situation. _id will be generated automatically.' });

    return Situation.create(_.omit(req.body, 'status', 'token'), function(err, persistedSituation) {
        if (err) return next(err);

        res.cookie('situation_' + persistedSituation.id, persistedSituation.token, { maxAge: 7 * 24 * 3600 * 1000, httpOnly: true });
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

var DETAILS_DEFAULT_ATTRIBUTES = {
    absolute_error_margin: 10,
};

// Attributes are sorted as they should appear in the YAML test file
var DETAILS_ATTRIBUTES = [
    'name',
    'description',
    'extension',
    'absolute_error_margin',
    'relative_error_margin',
    'output_variables',
];

exports.openfiscaTest = function(req, res) {
    var details = _.assign({}, DETAILS_DEFAULT_ATTRIBUTES,
        _.pick(req.body, DETAILS_ATTRIBUTES)
    );
    if (! details.name || ! details.description || ! details.output_variables) {
        return res.status(403).send({ error: 'You must provide a name, description and output_variables.' });
    }

    var situation = req.situation.toObject ? req.situation.toObject() : req.situation;
    res.type('yaml').send(openfiscaTest.generateYAMLTest(details, situation));
};

