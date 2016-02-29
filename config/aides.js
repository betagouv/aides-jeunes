import fs from 'fs';

import loadConstYaml from '../lib/loadConstYaml';


const AIDES_FOLDER = `${__dirname}/../data`;

let result = {};

fs.readdirSync(AIDES_FOLDER)
  .forEach(filename => {
      const [ id, yamlExtensionMarker ] = filename.split('.yaml');

      if (yamlExtensionMarker === undefined) return;  // ignore files that are not YAML

      result[id] = loadConstYaml(`${AIDES_FOLDER}/${filename}`);
  });

export default Object.freeze(result);
