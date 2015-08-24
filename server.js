#!/usr/bin/env babel-node
import path from 'path';

import hapi from 'hapi';
import inert from 'inert';


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


server.register(inert, (err) => { if (err) throw err });   // serve static files

server.connection({
    port: 9000
});

server.route(require('./routes'));

server.start(() => console.log(`Server running at: ${server.info.uri}`));

module.exports = server;
