import fs from 'fs';

import yaml from 'js-yaml';
import git from 'git-rev';


export default [
{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        fs.readFile('./config/aides.yaml', (err, data) => {
            let aides = yaml.safeLoad(data);

            reply.view('index', {
                aides: aides,
                aidesCount: Object.keys(aides).length,
            });
        });
    },
},
{
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: './static',
        },
    },
},
{
    method: 'GET',
    path: '/debug',
    handler: (request, reply) => {
        git.long((sha) => {
            reply({
                hapi: request.server.version,
                rev: sha,
                server: request.server.info,
            });
        });
    },
},
]
