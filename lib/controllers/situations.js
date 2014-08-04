var mongoose = require('mongoose');
var _ = require('lodash');
var request = require('superagent');
var fs = require('fs');

var openfisca = require('../simulation/openfisca');

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
    Situation.create(_.omit(req.body, 'status'), function(err, situation) {
        if (err) return next(err);
        console.log(situation);
        res.send(situation);
    });
};

exports.simulation = function(req, res, next) {
    openfisca.simulate(req.situation, function(err, result) {
        if (err) next(err);
        res.send(result);
    });
};

exports.cmuCerfa = function(req, res) {
    var file = fs.createWriteStream('/home/nanocom/coucou.pdf');
    request
        .post('http://localhost:9001/cmu')
        .send(req.situation)
        .end(function(err, response) {
            response.pipe(file);
            res.download('/home/nanocom/coucou.pdf');
            file.on('finish', function() {
                res.download('/home/nanocom/coucou.pdf');
            });
        });

    /*request
          .post('http://localhost:9001/cmu')
          .send(req.situation)
          .end(function(err, response) {

              if (err) return next(err);
              if (response.error) {
                  return next({ apiError: 'Communication error with CMU Form Filler' });
              }

              fs.writeFile("/home/nanocom/coucou.pdf", response);
              res.download("/home/nanocom/coucou.pdf");
              next(null, response.body);
          });*/
};

exports.openfiscaRequest = function(req, res) {
    res.send(openfisca.buildRequest(req.situation));
};

exports.openfiscaResponse = function(req, res, next) {
    openfisca.calculate(req.situation, function(err, result) {
        if (err) next(err);
        res.send(result);
    });
};
