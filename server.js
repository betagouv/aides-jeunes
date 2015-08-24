#!/usr/bin/env node
var path = require('path');

var hapi = require('hapi'),
    inert = require('inert');


var server = new hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    },
    debug: {
        request: ['error']
    }
});


server.register(inert, function(err) { if (err) throw err });   // serve static files

server.connection({
    port: 9000
});

server.route({
    method: 'GET',
    path: '/',
    handler: {
        file: 'index.html'
    }
});

server.start(function() {
    console.log('Server running at:', server.info.uri);
});

module.exports = server;
