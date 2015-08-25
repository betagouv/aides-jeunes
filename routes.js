import fs from 'fs';

import yaml from 'js-yaml';


export default [
{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        fs.readFile('./config/aides.yaml', (err, data) => {
            let aides = yaml.safeLoad(data);

            reply.view('index', {
                aidesCount: Object.keys(aides).length,
            });
        });
    },
},
]
