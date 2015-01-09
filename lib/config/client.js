var express = require('express');
var favicon = require('static-favicon');
var path = require('path');

var rootPath = path.join(__dirname, '..', '..');

module.exports = function(app) {
    var env = app.get('env');
    var viewsDirectory = rootPath;

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

        app.use('/acceptance-tests', express.static(path.join(rootPath, 'app')));
        app.use(express.static(path.join(rootPath, '.tmp')));
        app.use(express.static(path.join(rootPath, 'app')));

        viewsDirectory += '/app/views';
    }

    if ('production' === env) {
        app.use(favicon(path.join(rootPath, 'dist', 'favicon.ico')));
        app.use('/acceptance-tests', express.static(path.join(rootPath, 'dist')));
        app.use(express.static(path.join(rootPath, 'dist')));

        viewsDirectory += '/dist/views';
    }

    app.use('/partials', express.static(viewsDirectory + '/partials/front'));
    app.use('/acceptance-tests/partials', express.static(viewsDirectory + '/partials/acceptance-tests'));

    var error404 = function(req, res) {
        return res.send(404);
    };
    app.use('/partials', error404);
    app.use('/acceptance-tests/partials', error404);

    function renderAcceptanceTests(req, res) {
        res.sendfile(viewsDirectory + '/acceptance-tests.html');
    }

    app.route('/acceptance-tests').get(renderAcceptanceTests);
    app.route('/acceptance-tests/*').get(renderAcceptanceTests);

    app.route('/*').get(function(req, res) {
        res.sendfile(viewsDirectory + '/front.html');
    });

};
