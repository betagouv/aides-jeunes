var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var mustache = require('consolidate').mustache;
var utils = require('./backend/lib/utils');

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


    app.route('/recap-situation/*').get(function(req, res) {
        res.sendFile(viewsDirectory + '/embed.html');
    });

};
