'use strict';

var _ = require('lodash');

var index = require('./controllers');
var flatten = require('./situation').flatten;
var Individu = require('./situation').Individu;
var openfisca = require('./simulation/openfisca');
var SituationModel = require('./models/situation');
var expand = require('./situation').expand;

module.exports = function(app) {

    app.get('/api/situations/:situationId', function(req, res, next) {
        SituationModel.findById(req.params.situationId, function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            res.send(situation);
        });
    });

    app.post('/api/situations', function(req, res, next) {
        var demandeur = new Individu();
        demandeur.ajouteLogement();
        SituationModel.create(flatten(demandeur), function(err, situation) {
            if (err) return next(err);
            res.send(situation.id);
        });
    });

    app.put('/api/situations/:situationId', function(req, res, next) {
        SituationModel.findByIdAndUpdate(req.params.situationId, _.extend({ _updated: Date.now() }, _.omit(req.body, '_id')), { upsert: true }, function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(400);
            res.send(situation);
        });
    });

    app.get('/api/situations/:situationId/simulation', function(req, res, next) {
        SituationModel.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            openfisca.simulate(expand(situation), function(err, result) {
                if (err) next(err);
                res.send(result);
            });
        });
    });

    app.get('/api/situations/:situationId/openfisca-response', function(req, res, next) {
        SituationModel.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            openfisca.calculate(expand(situation), function(err, result) {
                if (err) next(err);
                res.send(result);
            });
        });
    });

    app.get('/api/situations/:situationId/openfisca-request', function(req, res, next) {
        SituationModel.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            res.send(openfisca.buildRequest(expand(situation)));
        });
    });

    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.route('/partials/*').get(index.partials);
    app.route('/*').get(index.index);
};
