var express = require('express');
var path = require('path');
var fs = require('fs');

function createApi(passport) {
    var api = express();

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

module.exports = function(app, passport) {
    app.use('/api', createApi(passport));
};
