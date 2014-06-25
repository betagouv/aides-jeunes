var mongoose = require('mongoose');

var Task = mongoose.model('Task');

exports.task = function(req, res, next, id) {
    Task
        .findById(id)
        .populate('situation')
        .exec(function(err, task) {
            if (err) return next(err);
            if (!task) return res.send(404);
            req.task = task;
            next();
        });
};

exports.list = function(req, res, next) {
    Task
        .find()
        .populate('situation')
        .limit(20)
        .sort('-situation._updated')
        .exec(function(err, tasks) {
            if (err) return next(err);
            res.send(tasks);
        });
};

exports.show = function(req, res) {
    res.send(req.task);
};

exports.update = function(req, res, next) {
    req.task
        .set(req.body)
        .save(function(err, task) {
            if (err) return next(err);
            res.send(task);
        });
};
