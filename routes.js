import loadConstYaml from './lib/loadConstYaml';
import compute from './openfisca/compute';


const AIDES = loadConstYaml('config/aides'),
      DEFAULT_RENDER_CONTEXT = Object.seal({
          stylesheets: loadConstYaml('css/common'),
      });


export default [
{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        view(reply, 'homepage', {
            aides: AIDES,
            aidesCount: Object.keys(AIDES).length,
        });
    },
},
{
    method: 'GET',
    path: '/situation',
    handler: (request, reply) => {
        view(reply, 'situation', {
        });
    },
},
{
    method: 'POST',
    path: '/resultat',
    handler: (request, reply) => {
        compute(JSON.parse(request.payload.situation), (err, results) => {
            view(reply, 'results', {
                aides: results,
                aidesCount: results ? Object.keys(results).length : 0,
                error: err && JSON.stringify(err, null, 2),  // (null, 2) = "indent by 2 spaces"
            });
        })
    },
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
