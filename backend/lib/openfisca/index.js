var config = require('../../config');
var mapping = require('./mapping');
var rp = require('request-promise');

var buildOpenFiscaRequest = exports.buildOpenFiscaRequest = mapping.buildOpenFiscaRequest;
function sendToOpenfisca(endpoint) {
    return function(situation, callback) {
        var request;
        try {
            request = buildOpenFiscaRequest(situation);
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
            }).catch(callback); // FIXME If the callback throw an Error, called twice
    };
}

exports.calculate = sendToOpenfisca('calculate');
exports.trace = sendToOpenfisca('trace');

exports.getParameter = function(parameterId, callback) {
    rp({
        uri: config.openfiscaURL + '/parameter/' + parameterId,
        method: 'GET',
        json: true
    })
        .then(function(result) {
            callback(result);
        });
};
