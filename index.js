var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var mustache = require('consolidate').mustache;
var bodyParser = require('body-parser');
var utils = require('./backend/lib/utils');
var Followup = require('mongoose').model('Followup');
var benefits = require('./app/js/constants/benefits');
var renderSurvey = require('./backend/lib/mes-aides/emails/survey').render;

function countPublicByType(type) {
    return Object.keys(benefits[type]).reduce(function(total, provider) {
        return total + Object.keys(benefits[type][provider].prestations).reduce(function(count, prestationName) {
            var prestation = benefits[type][provider].prestations[prestationName];

            return count + (prestation.private ? 0 : 1);
        }, 0);
    }, 0);
}

var prestationsNationalesCount = countPublicByType('prestationsNationales');
var partenairesLocauxCount = countPublicByType('partenairesLocaux');

let puppeteerArgs = {};
if (process.env.PUPPETEER_ARGS) {
    try {
        puppeteerArgs = JSON.parse(process.env.PUPPETEER_ARGS);
    } catch(e) {
        // Do nothing
    }
}

module.exports = function(app) {
    var env = app.get('env');
    var directory = 'dist';

    if ('development' === env) {

        app.use(require('connect-livereload')({
            port: parseInt(process.env.LIVERELOAD_PORT) || 35729
        }));

        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/js/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

    }

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

    app.set('trust proxy', true);

    app.use('/js',        express.static(path.join(__dirname, 'dist/js'),        CACHE.ONE_YEAR));
    app.use('/styles',    express.static(path.join(__dirname, 'dist/styles'),    CACHE.ONE_YEAR));
    app.use('/fonts',     express.static(path.join(__dirname, 'dist/fonts'),     CACHE.ONE_YEAR));
    app.use('/img',       express.static(path.join(__dirname, 'dist/img'),       CACHE.FIVE_MINUTES));
    app.use('/documents', express.static(path.join(__dirname, 'dist/documents'), CACHE.FIVE_MINUTES));
    app.use(              express.static(path.join(__dirname, 'dist'),           CACHE.NONE));

    app.use(bodyParser.urlencoded({ limit: '1024kb' }));

    // Route to download a PDF
    app.route('/foyer/resultat').post(function(req, res) {
        var html = Buffer.from(req.body.base64, 'base64').toString('utf-8');

        var pdfOptions = {
            format: 'A4',
            margin: {
                top: '0.5cm',
                right: '2cm',
                bottom: '0.5cm',
                left: '2cm'
            }
        };

        var callback = function (pdf) {
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=MesAides_simulation_' + req.body.basename + '.pdf',
            });
            res.end(pdf, 'binary');
        };

        utils.convertHTMLToPDF(html, callback, pdfOptions, puppeteerArgs, false);
    });

    app.route('/recap-situation/*').get(function(req, res) {
        res.sendFile(viewsDirectory + '/embed.html');
    });

    if (app.get('env') === 'development') {
        app.route('/emails/followups/:followupId/survey.html').get(function(req, res) {
            Followup.findById(req.params.followupId).exec(function(err, followup) {
                if (err) return next(err);
                if (! followup) return res.sendStatus(404);
                renderSurvey(followup)
                    .then(survey => res.send(survey.html));
            });
        });
    }

    app.route('/*').get(function(req, res) {
        res.render('front', {
            prestationsCount: prestationsNationalesCount + partenairesLocauxCount,
        });
    });

    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(parseInt(err.code) || 500).send(err);
        next();
    });
};
