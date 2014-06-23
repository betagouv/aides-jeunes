'use strict';

var path = require('path');

exports.frontPartials = function(req, res) {
    var stripped = req.url.split('.')[0];
    stripped = stripped.split('/');
    stripped.splice(2, 0, 'front');
    stripped = stripped.join('/');
    var requestedView = path.join('./', stripped);
    res.render(requestedView, function(err, html) {
        if (err) {
            console.log("Error rendering partial '" + requestedView + "'\n", err);
            res.status(404);
            res.send(404);
        } else {
            res.send(html);
        }
    });
};

exports.front = function(req, res) {
    res.render('front');
};

exports.backPartials = function(req, res) {
    var stripped = req.url.split('.')[0];
    stripped = stripped.split('/');
    stripped.splice(1, 1);
    stripped.splice(2, 0, 'back');
    stripped = stripped.join('/');
    var requestedView = path.join('./', stripped);
    res.render(requestedView, function(err, html) {
        if (err) {
            console.log("Error rendering partial '" + requestedView + "'\n", err);
            res.status(404);
            res.send(404);
        } else {
            res.send(html);
        }
    });
};

exports.back = function(req, res) {
  console.log('requested BACCCCKKK');
    res.render('back');
};
