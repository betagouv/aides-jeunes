/*
** Module dependencies
*/
var config = require('../../config/config');
var http = require('http');
var mapping = require('./mapping');
var url = require('url');

var openfiscaURL = url.parse(config.openfiscaApi);

function sendOpenfiscaRequest(simulation, callback) {
    var postData = JSON.stringify(simulation);
    var options = {
        hostname: openfiscaURL.hostname,
        port: openfiscaURL.port,
        path: 'calculate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var request = http.request(options, function(response) {
        response.setEncoding('utf8');
        var rawData = '';
        response.on('data', function(chunk) { rawData += chunk; });
        response.on('end', function() {
            try {
                var content = JSON.parse(rawData);
                if (response.statusCode == 200) {
                    callback(null, content);
                } else {
                    callback(content.error);
                }
            } catch (e) {
                callback({
                    code: 500,
                    errors: 'Can\'t parse: ' + rawData,
                    message: e.message,
                    stack: e.stack,
                });
            }
        });
    });
    request.write(postData);

    request.on('error', callback);
    request.end();
}

var buildOpenFiscaRequest = exports.buildOpenFiscaRequest = mapping.buildOpenFiscaRequest;

function calculate(situation, callback) {
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
    sendOpenfiscaRequest(request, callback);
}

exports.calculate = calculate;
