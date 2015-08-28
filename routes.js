import fs from 'fs';

import yaml from 'js-yaml';
import git from 'git-rev';


const DEFAULT_RENDER_CONTEXT = Object.seal({
    stylesheets: yaml.safeLoad(fs.readFileSync('./css/common.yaml'))
});


function context(data) {
    var result = {};

    for (let key in DEFAULT_RENDER_CONTEXT)
        result[key] = DEFAULT_RENDER_CONTEXT[key];

    for (let key in data)
        result[key] = data[key];

    return result;
}


export default [
{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        fs.readFile('./config/aides.yaml', (err, data) => {
            let aides = yaml.safeLoad(data);

            reply.view('index', context({
                aides: aides,
                aidesCount: Object.keys(aides).length,
            }));
        });
    },
},
{
    method: 'GET',
    path: '/css/{param*}',
    handler: {
        directory: {
            path: './css',
        },
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
