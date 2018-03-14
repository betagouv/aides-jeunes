var config = require('../../config/config');
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
            uri: config.openfiscaApi + '/' + endpoint,
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
