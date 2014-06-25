'use strict';

var _ = require('lodash');
var express = require('express');
var mongoose = require('mongoose');

var flatten = require('./situation').flatten;
var Individu = require('./situation').Individu;
var openfisca = require('./simulation/openfisca');
var expand = require('./situation').expand;

var Task = mongoose.model('Task');
var Situation = mongoose.model('Situation');

function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return res.send(401);
    next();
}

module.exports = function(app, passport, config) {

    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local', function(err, agent) {
            if (err) return next(err);
            if (!agent) return res.send(400);
            req.logIn(agent, function(err) {
                if (err) return next(err);
                res.send(_.omit(agent.toObject(), 'password'));
            });
        })(req, res, next);
    });

    app.get('/api/profile', ensureAuthenticated, function(req, res) {
        res.send(req.user);
    });

    app.get('/api/situations/:situationId', function(req, res, next) {
        Situation.findById(req.params.situationId, function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            res.send(situation);
        });
    });

    app.post('/api/situations', function(req, res, next) {
        var demandeur = new Individu();
        demandeur.ajouteLogement();
        Situation.create(flatten(demandeur), function(err, situation) {
            if (err) return next(err);
            res.send(situation.id);
        });
    });

    app.put('/api/situations/:situationId', function(req, res, next) {
        Situation.findByIdAndUpdate(req.params.situationId, _.extend({ _updated: Date.now() }, _.omit(req.body, '_id')), { upsert: true }, function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(400);
            res.send(situation);

            if (situation.contact.firstName) {
                Task.generateTasksForSituation(situation);
            }
        });
    });

    app.get('/api/situations/:situationId/simulation', function(req, res, next) {
        Situation.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            openfisca.simulate(expand(situation), function(err, result) {
                if (err) next(err);
                res.send(result);
            });
        });
    });

    app.get('/api/situations/:situationId/openfisca-response', function(req, res, next) {
        Situation.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            openfisca.calculate(expand(situation), function(err, result) {
                if (err) next(err);
                res.send(result);
            });
        });
    });

    app.get('/api/situations/:situationId/openfisca-request', function(req, res, next) {
        Situation.findById(req.params.situationId).lean().exec(function(err, situation) {
            if (err) return next(err);
            if (!situation) return res.send(404);
            res.send(openfisca.buildRequest(expand(situation)));
        });
    });

    app.get('/api/tasks', function(req, res, next) {
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

    app.get('/api/tasks/:taskId', function(req, res, next) {
        Task.findById(req.params.taskId, function(err, task) {
            if (err) return next(err);
            console.log('coucou');
            if (!task) return res.send(404);
            console.log('tata');
            res.send(task);
        });
    });

    app.put('/api/tasks/:taskId', function(req, res, next) {
        Task.findByIdAndUpdate(req.params.taskId, req.body, function(err, task) {
            if (err) return next(err);
            if (!task) return res.send(400);
            res.send(task);
        });
    });

    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    var env = app.get('env');
    var viewsDirectory = config.root;
    if ('development' === env) {
        viewsDirectory += '/app/views';
    } else if ('production' === env) {
        viewsDirectory += '/public/views';
    }

    app.use('/partials', express.static(viewsDirectory + '/partials/front'));
    app.use('/back/partials', express.static(viewsDirectory + '/partials/back'));

    function renderBack(req, res) {
        res.sendfile(viewsDirectory + '/back.html');
    }

    app.route('/back').get(renderBack);
    app.route('/back/*').get(renderBack);

    app.route('/*').get(function(req, res) {
        res.sendfile(viewsDirectory + '/front.html');
    });
};
