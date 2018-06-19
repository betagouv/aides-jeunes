var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var mustache = require('consolidate').mustache;

var droitsDescription = require('./app/js/constants/droits');

function countByType(type) {
    return Object.keys(droitsDescription[type]).reduce(function(total, provider) {
        return total + Object.keys(droitsDescription[type][provider].prestations).length;
    }, 0);
}

var prestationsNationalesCount = countByType('prestationsNationales');
var partenairesLocauxCount = countByType('partenairesLocaux');

module.exports = function(app) {
    var env = app.get('env');
    var directory = 'dist';

    if ('development' === env) {
        directory = 'app';

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

        app.use(express.static(path.join(__dirname, directory)));
        app.use('/styles/front.css', express.static(path.join(__dirname, 'tmp/styles/front.css')));
    }
    app.use('/recap-situation', express.static(path.join(__dirname, directory)));

    var viewsDirectory = path.join(__dirname, directory, 'views');
    app.use(favicon(path.join(__dirname, directory, 'img', 'favicon', 'favicon.ico')));

    var CACHE = {
        ONE_YEAR: { maxAge: 365 * 24 * 60 * 60 * 1000 },  // assets that are cachebusted through the `rev` build step that changes file names
        FIVE_MINUTES: { maxAge: 5 * 60 * 1000 },  // assets that are not cachebusted through filenames but not critical, allow for 5 minutes of scramble in case they are updated
        NONE: {},
    };

    app.engine('html', mustache);
    app.set('view engine', 'html');
    app.set('views', viewsDirectory);

    app.use('/js',        express.static(path.join(__dirname, 'dist/js'),        CACHE.ONE_YEAR));
    app.use('/styles',    express.static(path.join(__dirname, 'dist/styles'),    CACHE.ONE_YEAR));
    app.use('/fonts',     express.static(path.join(__dirname, 'dist/fonts'),     CACHE.ONE_YEAR));
    app.use('/img',       express.static(path.join(__dirname, 'dist/img'),       CACHE.FIVE_MINUTES));
    app.use('/documents', express.static(path.join(__dirname, 'dist/documents'), CACHE.FIVE_MINUTES));
    app.use(              express.static(path.join(__dirname, 'dist'),           CACHE.NONE));

    app.use('/recap-situation/partials', express.static(path.join(viewsDirectory + '/partials')));
    app.use('/partials', express.static(viewsDirectory + '/partials'));
    app.use('/content-pages', express.static(viewsDirectory + '/content-pages'));
    app.use('/partials', function(req, res) {
        return res.sendStatus(404);
    });

    app.use('/js/lib', express.static(path.join(__dirname, 'node_modules'), {
        fallthrough: false,  // short-circuit 404s
        index: false,
    }));

    app.route('/recap-situation/*').get(function(req, res) {
        res.sendFile(viewsDirectory + '/embed.html');
    });

    app.route('/*').get(function(req, res) {
        res.render('front', {
            prestationsCount: prestationsNationalesCount + partenairesLocauxCount
        });
    });

    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(parseInt(err.code) || 500).send(err);
        next();
    });
};
