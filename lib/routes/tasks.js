var mongoose = require('mongoose');

var Task = mongoose.model('Task');

module.exports = function(api) {

    api.get('/tasks', function(req, res, next) {
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

    api.get('/tasks/:taskId', function(req, res, next) {
        Task.findById(req.params.taskId).populate('situation').exec(function(err, task) {
            if (err) return next(err);
            console.log('coucou');
            if (!task) return res.send(404);
            console.log('tata');
            res.send(task);
        });
    });

    api.put('/tasks/:taskId', function(req, res, next) {
        Task.findByIdAndUpdate(req.params.taskId, req.body, function(err, task) {
            if (err) return next(err);
            if (!task) return res.send(400);
            res.send(task);
        });
    });

};
