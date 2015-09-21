import fs from 'fs';

import yaml from 'js-yaml';


export default function loadConstYaml(filePath) {
    return Object.seal(yaml.safeLoad(fs.readFileSync(`${filePath}.yaml`)));
}
