var mongoose = require('mongoose');
var _ = require('lodash');

var AcceptanceTest = mongoose.model('AcceptanceTest');

exports.find = function(req, res, next, id) {
    AcceptanceTest.findById(id, function(err, acceptanceTest) {
        if (err) return next(err);
        if (!acceptanceTest) return res.send(404);
        req.acceptanceTest = acceptanceTest;
        next();
    });
};

exports.list = function(req, res, next) {
    AcceptanceTest.find().exec(function(err, acceptanceTests) {
        if (err) return next(err);
        res.send(acceptanceTests);
    });
};

exports.create = function(req, res, next) {
    AcceptanceTest.create(req.body, function(err, acceptanceTest) {
        if (err) return next(err);
        res.send(acceptanceTest);
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
