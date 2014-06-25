'use strict';

var express = require('express'),
    favicon = require('static-favicon'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./config'),
    mongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose');

/**
 * Express configuration
 */
module.exports = function(app) {
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

    app.use(bodyParser());
    app.use(cookieParser());

    // Persist sessions with mongoStore
    app.use(session({
        secret: config.sessionSecret,
        store: new mongoStore({
            db: mongoose.connection.db,
            collection: 'sessions'
        }, function () {
            console.log('db connection open');
        })
    }));

    // Error handler - has to be last
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }
};
