var express = require('express');
var favicon = require('static-favicon');
var path = require('path');

module.exports = function(app, config) {
    var env = app.get('env');
    var viewsDirectory = config.root;

    if ('development' === env) {
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

        viewsDirectory += '/app/views';
    }

    if ('production' === env) {
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use('/secours-populaire', express.static(path.join(config.root, 'public')));
        app.use('/back', express.static(path.join(config.root, 'public')));
        app.use(express.static(path.join(config.root, 'public')));

        viewsDirectory += '/public/views';
    }

    app.use('/partials', express.static(viewsDirectory + '/partials/front'));
    app.use('/back/partials', express.static(viewsDirectory + '/partials/back'));

    function renderBack(req, res) {
        res.sendfile(viewsDirectory + '/back.html');
    }

    app.route('/back').get(renderBack);
    app.route('/back/*').get(renderBack);

    app.route('/*').get(function(req, res) {
        res.sendfile(viewsDirectory + '/front.html');
    });

};
