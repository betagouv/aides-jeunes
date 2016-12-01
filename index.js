var express = require('express');
var favicon = require('serve-favicon');
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

        app.use('/recap-situation', express.static(path.join(__dirname, 'app')));
        app.use(express.static(path.join(__dirname, 'app')));

        viewsDirectory += '/app/views';
    } else {
        // prerender.io
        app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN).set('protocol', 'https'));

        app.use('/recap-situation', express.static(path.join(__dirname, 'dist')));

        viewsDirectory += '/dist/views';
    }

    app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, 'dist')));

    app.use('/partials', express.static(viewsDirectory + '/partials'));
    app.use('/content-pages', express.static(viewsDirectory + '/content-pages'));
    app.use('/partials', function(req, res) {
        return res.send(404);
    });

    app.use('/js/lib', express.static(path.join(__dirname, 'node_modules'), {
        fallthrough: false,  // short-circuit 404s
        index: false,
    }));

    app.route('/recap-situation/*').get(function(req, res) {
        res.sendFile(viewsDirectory + '/embed.html');
    });

    app.route('/*').get(function(req, res) {
        res.sendFile(viewsDirectory + '/front.html');
    });
};
