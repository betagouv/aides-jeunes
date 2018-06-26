var auth = require('basic-auth');
var situations = require('../situations');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../../config/config');

moment.locale('fr');

var fields = [{
    label: 'votre date de naissance',
    value: '1940-12-12',
    formatter: function(value) { return moment(value).format('LL'); },
    key: 'date_naissance_dem'
}, {
    label: 'votre situation familiale',
    value: 0,
    formatter: function() { return 'Célibataire'; },
    key: 'situationfam_dem'
}, {
    label: 'vos salaires (net) sur les 12 derniers mois',
    value: 800*12,
    formatter: function(value) { return value.toString() + ' €'; },
    key: 'salaire_dem'
}, {
    label: 'votre retraite (net) sur les 12 derniers mois',
    value: 500*12,
    formatter: function(value) { return value.toString() + ' €'; },
    key: 'montantRetraite_dem'
}, {
    label: 'vos allocations sur les 12 derniers mois',
    value: 200*12,
    formatter: function(value) { return value.toString() + ' €'; },
    key: 'allocations_dem'
}];

var teleservices = [{
    name: 'loiret_APA_test',
    fields: fields,
    destination: {
        label: 'du Loiret (test)',
        url: 'https://reflexe45-test.loiret.fr/public/requestv2/accountless/teleprocedure_id/92/'
    }
}, {
    name: 'localtest',
    fields: fields,
    destination: {
        label: 'en local',
        url: 'http://localhost:3000/prefill/'
    }
}, {
    name: 'livetest',
    fields: fields,
    destination: {
        label: 'en ligne',
        url: 'http://test.mes-aides.gouv.fr/prefill/'
    }
}];

var teleserviceMap = teleservices.reduce(function(obj, ts) {
    obj[ts.name] = ts;
    return obj;
}, {});

var prod = config.env == 'production';
// Always returns 404 to avoid leaking information
function fail(res, msg) {
    if (prod)
        return res.sendStatus(404);

    return res.status(404).send({ error: msg });
}

/*
 * Each teleservice requires a specific representation of the situation.
 * Users needs to know what data is made available to third parties.
 * This function generated endpoint callback that respond
 * - decorated data with metadata for display and
 * - the appropriate URL to third party teleservice.
 */
exports.metadataResponseGenerator = function(teleservice) {
    return function(req, res) {
        var payload = {
            id: req.situation._id,
            scope: teleservice.name,
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expires after one hour
        };

        var token = jwt.sign(payload, req.situation.token);

        return res.json({
            fields: teleservice.fields.map(function(field) {
                return Object.assign(field, { formattedValue: field.formatter ? field.formatter(field.value) : field.value });
            }),
            destination: {
                label: teleservice.destination.label,
                url: teleservice.destination.url + '?code=' + token,
            },
        });
    };
};

/*
 * This callback attachs
 * - the token sent (a JWT)
 * - the decoded token as payload (generated in metadataResponseGenerator)
 * - the appropriate teleservice using the scope name
 */
exports.decodePayload = function(req, res, next, token) {
    req.token = token;
    req.payload = jwt.decode(token);
    if (! req.payload) return fail(res, 'Corrupted payload');
    if ((! req.payload.scope) || (! teleserviceMap[req.payload.scope])) return fail(res, 'Invalid scope');

    req.teleservice = teleserviceMap[req.payload.scope];
    next();
};

var tokens = config.teleserviceAccessTokens || {};
/*
 * This callback validates the basic authorization cookie content
 */
exports.checkCredentials = function(req, res, next) {
    var credentials = auth(req);
    if ((! credentials) || (! tokens[credentials.name]) || (credentials.pass != tokens[credentials.name])) {
        res.status(401)
        .setHeader('WWW-Authenticate', 'Basic realm="MesAidesTeleservices"');
        res.send({ error: 'Not autorized'});
    } else {
        next();
    }
};

/*
 * This callback attachs the appropriate situations
 * It requires a payload with an identifier
 */
exports.attachPayloadSituation = function(req, res, next) {
    situations.situation(req, res, next, req.payload.id);
};

/*
 * This callback validates user consent to share data with the third party
 * * The consent is considered given if the token is signed by the token attached to the situation
 * It requires a situation
 */
exports.verifyRequest = function(req, res, next) {
    jwt.verify(req.token, req.situation.token, function(err) {
        if (err) { return fail(res, err); }
        next();
    });
};

/*
 * This function returns a key/value object representing the requested situation to prefill a specific teleservice.
 * At the moment, the key/value pairs are hardcoded but it mimics the expected behavior.
 */
exports.exportRepresentation = function(req, res) {
    return res.json(req.teleservice.fields.reduce(function(obj, field) {
        obj[field.key] = field.value;
        return obj;
    }, {}));
};

for (var i = 0; i < teleservices.length; i++) {
    exports[teleservices[i].name] = teleservices[i];
}

exports.names = teleservices.map(function(ts) { return ts.name; });
