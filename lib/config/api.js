var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('./mongostore')(session);

function createApi(passport, config) {
    var api = express();

    api.use(bodyParser());
    api.use(cookieParser());

    // Persist sessions with mongoStore
    api.use(session({
        secret: config.sessionSecret,
        store: new MongoStore()
    }));

    // Handle passport authentication
    api.use(passport.initialize());
    api.use(passport.session());

    var routesPath = path.join(__dirname, '../routes');
    fs.readdirSync(routesPath).forEach(function (file) {
        if (/(.*)\.(js$|coffee$)/.test(file)) {
            require(routesPath + '/' + file)(api, passport);
        }
    });

    api.all('*', function(req, res) {
        res.send(404);
    });

    return api;
}

module.exports = function(app, passport, config) {
    app.use('/api', createApi(passport, config));
};
