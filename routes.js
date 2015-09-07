import fs from 'fs';

import yaml from 'js-yaml';
import git from 'git-rev';


const DEFAULT_RENDER_CONTEXT = Object.seal({
    stylesheets: yaml.safeLoad(fs.readFileSync('./css/common.yaml'))
});


export default [
{
    method: 'GET',
    path: '/',
    handler: (() => {
        let aides = yaml.safeLoad(fs.readFileSync('./config/aides.yaml'));

        return (request, reply) => {
            view(reply, 'homepage', {
                aides: aides,
                aidesCount: Object.keys(aides).length,
            });
        }
    })(),
},
{
    method: 'GET',
    path: '/css/{param*}',
    handler: { directory: { path: './css' } },
},
{
    method: 'GET',
    path: '/static/{param*}',
    handler: { directory: { path: './static' } },
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


function view(reply, name, data = {}) {
    let context = Object.create(DEFAULT_RENDER_CONTEXT);  // use prototypal inheritance to avoid costly deep copies

    context.stylesheets = DEFAULT_RENDER_CONTEXT.stylesheets.concat(`/css/${name}`);  // don't push into the parent

    for (let key in data)
        context[key] = data[key];

    return reply.view(name, context);
}
