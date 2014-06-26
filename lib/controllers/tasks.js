var mongoose = require('mongoose');
var _ = require('lodash');

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
    var org = req.user.organization;

    var query = Task
        .find()
        .populate('situation')
        .limit(20)
        .sort('_created');

    if (!org.isAdmin) {
        query.where('type').in(org.roles);
    }

    query.exec(function(err, tasks) {
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

exports.changeStatus = function(req, res, next) {
    var status = req.body.status; console.log('lol' + status);
    if (_.contains(['ok', 'ko'], status)) {
        return res.send(400);
    }


    req.task.status = status;
    req.task.save(function(err, task) {
        if (err) return next(err);
        res.send(task);
    });
};
