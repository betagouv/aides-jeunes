var mongoose = require('mongoose');

var AcceptanceTest = mongoose.model('AcceptanceTest');
var Situation = mongoose.model('Situation');

exports.find = function(req, res, next, id) {
    AcceptanceTest.findById(id, function(err, acceptanceTest) {
        if (err) return next(err);
        if (!acceptanceTest) return res.send(404);
        req.acceptanceTest = acceptanceTest;
        next();
    });
};

exports.list = function(req, res, next) {
    AcceptanceTest.find().setOptions({ sort: { name: 1 }}).exec(function(err, acceptanceTests) {
        if (err) return next(err);
        res.send(acceptanceTests);
    });
};

exports.create = function(req, res, next) {
    Situation.findById(req.body.situation, function(err, situation) {
        if (err) return next(err);
        if (!situation) return res.send(404);
        AcceptanceTest.create(req.body, function(err, acceptanceTest) {
            if (err) return next(err);
            situation.set('status', 'test').save(function(err) {
                if (err) return next(err);
                res.send(acceptanceTest);
            });
        });
    });
};

exports.show = function(req, res) {
    res.send(req.acceptanceTest);
};

exports.update = function(req, res, next) {
    req.acceptanceTest
        .set('_updated', Date.now())
        .set(req.body)
        .save(function(err) {
            if (err) return next(err);
            res.send(req.situation);
        });
};

exports.delete = function(req, res, next) {
    req.acceptanceTest.remove(function(err) {
        if (err) return next(err);
        res.send(204);
    });
};
