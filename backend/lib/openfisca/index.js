var config = require('../../config');
var mapping = require('./mapping');
var rp = require('request-promise');

var buildOpenFiscaRequest = exports.buildOpenFiscaRequest = mapping.buildOpenFiscaRequest;
function sendToOpenfisca(endpoint, transform) {
    if (! transform) {
        transform = buildOpenFiscaRequest;
    }

    return function(situation, callback) {
        var request;
        try {
            request = transform(situation);
        } catch(e) {
            return callback({
                message: e.message,
                name: e.name,
                stack: e.stack
            });
        }
        rp({
            uri: config.openfiscaURL + '/' + endpoint,
            method: 'POST',
            body: request,
            json: true,
        })
            .then(function(result) {
                callback(null, result);
            }).catch(callback);
    };
}

exports.calculate = sendToOpenfisca('calculate');
exports.trace = sendToOpenfisca('trace');
exports.sendToOpenfisca = sendToOpenfisca;

exports.get = function(item, callback) {
    rp({
        uri: `${config.openfiscaURL}${item}`,
        method: 'GET',
        json: true
    })
        .then(function(result) {
            callback(result);
        });
};
