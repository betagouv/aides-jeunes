var mongoose = require('mongoose');
var _ = require('lodash');

var flatten = require('../situation').flatten;
var Individu = require('../situation').Individu;
var openfisca = require('../simulation/openfisca');
var expand = require('../situation').expand;

var Situation = mongoose.model('Situation');
var Task = mongoose.model('Task');

module.exports = function(api) {

    api.get('/situations/:situationId', function(req, res, next) {
        Situation.findById(req.params.situationId, function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            res.send(situation);
        });
    });

    api.post('/situations', function(req, res, next) {
        var demandeur = new Individu();
        demandeur.ajouteLogement();
        Situation.create(flatten(demandeur), function(err, situation) {
            if (err) return next(err);
            res.send(situation.id);
        });
    });

    api.put('/situations/:situationId', function(req, res, next) {
        Situation.findByIdAndUpdate(req.params.situationId, _.extend({ _updated: Date.now() }, _.omit(req.body, '_id')), { upsert: true }, function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(400);
            res.send(situation);

            if (situation.contact.firstName) {
                Task.generateTasksForSituation(situation);
            }
        });
    });

    api.get('/situations/:situationId/simulation', function(req, res, next) {
        Situation.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            openfisca.simulate(expand(situation), function(err, result) {
                if (err) next(err);
                res.send(result);
            });
        });
    });

    api.get('/situations/:situationId/openfisca-response', function(req, res, next) {
        Situation.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            openfisca.calculate(expand(situation), function(err, result) {
                if (err) next(err);
                res.send(result);
            });
        });
    });

    api.get('/situations/:situationId/openfisca-request', function(req, res, next) {
        Situation.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            res.send(openfisca.buildRequest(expand(situation)));
        });
    });

};
