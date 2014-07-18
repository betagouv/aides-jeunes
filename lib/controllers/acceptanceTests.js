var mongoose = require('mongoose');

var AcceptanceTest = mongoose.model('AcceptanceTest');

exports.find = function(req, res, next, id) {
    AcceptanceTest.findById(id, function(err, acceptanceTest) {
        if (err) return next(err);
        if (!acceptanceTest) return res.send(404);
        req.acceptanceTest = acceptanceTest;
        next();
    });
};

exports.create = function(req, res, next) {
    AcceptanceTest.create(req.body, function(err, acceptanceTest) {
        if (err) return next(err);
        res.send(acceptanceTest);
    });
};

exports.list = function(req, res, next) {
    AcceptanceTest.find().exec(function(err, acceptanceTests) {
        console.log(acceptanceTests);
        if (err) return next(err);
        res.send(acceptanceTests);
    });
};
