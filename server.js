#!/usr/bin/env babel-node
import path from 'path';

import hapi from 'hapi';
import inert from 'inert';
import vision from 'vision';


if (process.env.NODE_ENV == 'test') {
    require('./test/mock/openfisca-superagent.js');
}


var server = new hapi.Server({
    debug: {
        request: ['error'],
    },
});


server.register(inert, (err) => { if (err) throw err });   // serve static files
server.register(vision, (err) => {
    if (err) throw err;

    server.views({
        context: { inTestMode: process.env.NODE_ENV == 'test' },
        engines: { handlebars: require('handlebars') },
        layout: true,
        partialsPath: 'templates/partials',
        path: 'templates',
        relativeTo: __dirname,
    });
});

server.connection({
    port: process.env.PORT,
});

server.route(require('./routes'));

server.start(() => console.log(`Server running at: ${server.info.uri}`));

module.exports = server;
