var express = require('express');
var favicon = require('static-favicon');
var path = require('path');

module.exports = function(app) {
    var env = app.get('env');
    var viewsDirectory = __dirname;

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

        app.use('/acceptance-tests', express.static(path.join(__dirname, 'app')));
        app.use('/recap-situation', express.static(path.join(__dirname, 'app')));
        app.use(express.static(path.join(__dirname, '.tmp')));
        app.use(express.static(path.join(__dirname, 'app')));

        viewsDirectory += '/app/views';
    }

    if ('production' === env) {
        // prerender.io
        app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN));

        app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
        app.use('/acceptance-tests', express.static(path.join(__dirname, 'dist')));
        app.use('/recap-situation', express.static(path.join(__dirname, 'dist')));
        app.use(express.static(path.join(__dirname, 'dist')));

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

    app.route('/recap-situation/*').get(function(req, res) {
        res.sendfile(viewsDirectory + '/embed.html');
    });

    app.route('/*').get(function(req, res) {
        res.sendfile(viewsDirectory + '/front.html');
    });

};
