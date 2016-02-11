import {
    wrap,
    compute,
} from './openfisca/compute';
import { reverseMap } from './openfisca/parse';
import AIDES from './config/aides';


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
    path: '/date-naissance',
    handler: (request, reply) => {
        view(reply, 'birthdate', {
            isQuestion: true,
        });
    },
},
{
    method: 'GET',
    path: '/logement',
    handler: (request, reply) => {
        view(reply, 'housing', {
            isQuestion: true,
        });
    },
},
{
    method: 'POST',
    path: '/resultat',
    handler: (request, reply) => {
        let situation = wrap(
            JSON.parse(request.payload.situation),
            (process.env.NODE_ENV == 'test' ? '2015-09' : undefined)
        );

        compute(situation)
            .then(openFiscaResponse => reverseMap(openFiscaResponse, situation))
            .then(results => {
                let aides = {};

                for (let aideId in results) {
                    aides[aideId] = Object.assign({
                        benefit: { amount: results[aideId] },
                    }, AIDES[aideId]);
                }

                view(reply, 'results', {
                    aides,
                    aidesCount: Object.keys(aides).length,
                });
            }, error => view(reply, 'results', { error }))
            .catch(error => process.nextTick(() => { throw error }));
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
    path: '/js/{param*}',
    handler: { directory: { path: './dist/js' } },
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
    data.templateName = name;
    return reply.view(name, data);
}
