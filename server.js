#!/usr/bin/env babel-node
import path from 'path';

import hapi from 'hapi';
import inert from 'inert';
import vision from 'vision';


var server = new hapi.Server({
    debug: {
        request: ['error'],
    },
});


server.register(inert, (err) => { if (err) throw err });   // serve static files
server.register(vision, (err) => {
    if (err) throw err;

    server.views({
        engines: { handlebars: require('handlebars') },
        layout: true,
        path: 'templates',
        partialsPath: 'templates/partials',
        relativeTo: __dirname,
    });
});

server.connection({
    port: process.env.PORT,
});

server.route(require('./routes'));

server.start(() => console.log(`Server running at: ${server.info.uri}`));

module.exports = server;
