var express = require('express');
var favicon = require('static-favicon');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var path = require('path');

/**
 * Express configuration
 */
module.exports = function(app, passport, config) {
    var env = app.get('env');

    if ('development' === env) {
        app.use(morgan('dev'));
        app.use(require('connect-livereload')());

        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/js/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

        app.use('/secours-populaire', express.static(path.join(config.root, 'app')));
        app.use('/back', express.static(path.join(config.root, 'app')));
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'app')));
    }

    if ('production' === env) {
        app.use(morgan());
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use('/secours-populaire', express.static(path.join(config.root, 'public')));
        app.use('/back', express.static(path.join(config.root, 'public')));
        app.use(express.static(path.join(config.root, 'public')));
    }

    // Error handler - has to be last
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }
};
