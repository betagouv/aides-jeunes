var mongoose = require('mongoose');
var _ = require('lodash');

var flatten = require('../situation').flatten;
var Individu = require('../situation').Individu;
var openfisca = require('../simulation/openfisca');
var expand = require('../situation').expand;

var Situation = mongoose.model('Situation');

exports.situation = function(req, res, next, id) {
    Situation.findById(id, function(err, situation) {
        if (err) return next(err);
        if (!situation) return res.send(404);
        req.situation = situation;
        next();
    });
};

exports.show = function(req, res) {
    res.send(req.situation);
};

exports.update = function(req, res, next) {
    req.situation
        .set('_updated', Date.now())
        .set(_.omit(req.body, 'status'))
        .save(function(err) {
            if (err) return next(err);
            res.send(req.situation);
        });
};

exports.submit = function(req, res, next) {
    req.situation.submit(function(err) {
        if (err) return next(err);
        res.send(req.situation);
    });
};

exports.create = function(req, res, next) {
    var demandeur = new Individu();
    demandeur.ajouteLogement();
    Situation.create(flatten(demandeur), function(err, situation) {
        if (err) return next(err);
        res.send(situation);
    });
};

exports.simulation = function(req, res, next) {
    openfisca.simulate(expand(req.situation.toObject()), function(err, result) {
        if (err) next(err);
        res.send(result);
    });
};

exports.openfiscaRequest = function(req, res) {
    res.send(openfisca.buildRequest(expand(req.situation.toObject())));
};

exports.openfiscaResponse = function(req, res, next) {
    openfisca.calculate(expand(req.situation.toObject()), function(err, result) {
        if (err) next(err);
        res.send(result);
    });
};
