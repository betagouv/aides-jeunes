#!/usr/bin/env node
var express = require('express');
var app = express();

var benefits = require('./app/js/constants/benefits');

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


// Start server
var port = process.env.PORT || 9000;

process.env.MES_AIDES_ROOT_URL = process.env.MES_AIDES_ROOT_URL || ('http://localhost:' + port);


require('./configure')(app);
require('./index.js')(app);

/*app.route('/*').get(function(req, res) {
    res.render('front', {
        prestationsCount: prestationsNationalesCount + partenairesLocauxCount,
    });
});//*/

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(parseInt(err.code) || 500).send(err);
    next();
});

app.listen(port, function () {
    console.log('Mes Aides server listening on port %d, in %s mode, expecting to be deployed on %s', port, app.get('env'), process.env.MES_AIDES_ROOT_URL);
});

module.exports = app;
