'use strict';

var _ = require('lodash');

var express = require('express');
var flatten = require('./situation').flatten;
var Individu = require('./situation').Individu;
var openfisca = require('./simulation/openfisca');
var SituationModel = require('./models/situation');
var Task = require('./models/task');
var expand = require('./situation').expand;

module.exports = function(app, config) {

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

            if (situation.contact.firstName) {
                Task.create({ type: 'nir_validation', status: 'ko', situation: situation });
                Task.create({ type: 'revenus_dgfip', status: 'ko', situation: situation });
            }
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

    app.get('/api/situations', function(req, res, next) {
        // var page = req.query.page || 1;
        Task
            .find()
            .populate('situation')
            .limit(20)
            .sort('-situation._updated')
            .exec(function(err, tasks) {
                if (err) return next(err);
                res.send(tasks);
            });
    });

    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    function renderBack(req, res) {
        res.sendfile(config.root + '/app/views/back.html');
    }

    app.use('/back/partials', express.static(config.root + '/app/views/partials/back'));
    app.route('/back').get(renderBack);
    app.route('/back/*').get(renderBack);

    function renderFront(req, res) {
        res.sendfile(config.root + '/app/views/front.html');
    }

    app.use('/partials', express.static(config.root + '/app/views/partials/front'));
    app.route('/*').get(renderFront);
};
