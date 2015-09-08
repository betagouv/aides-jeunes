import fs from 'fs';

import yaml from 'js-yaml';


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
    path: '/css/semantic-ui/{component}.css',
    handler: (request, reply) => {
        reply.file(`node_modules/semantic-ui-${request.params.component}/${request.params.component}.min.css`);
    },
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
        require('git-rev').long((sha) => {
            reply({
                hapi: request.server.version,
                rev: sha,
                server: request.server.info,
            });
        });
    },
},
]


function view(reply, name, data) {
    let context = Object.create(DEFAULT_RENDER_CONTEXT);  // use prototypal inheritance to avoid costly deep copies

    context.stylesheets = DEFAULT_RENDER_CONTEXT.stylesheets.concat(`/css/${name}`);  // don't push into the parent
    Object.assign(context, data);  // this means data.stylesheets overrides all default stylesheets; this behavior can be changed, no use case atm

    return reply.view(name, context);
}
