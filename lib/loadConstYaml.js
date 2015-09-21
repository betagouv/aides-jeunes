import fs from 'fs';

import yaml from 'js-yaml';


/** Loads the contents of a YAML file, preventing alterations of the returned object.
 *
 * @param  {String} File path, relative to project root (the directory that contains the package.json).
 * @return Parsed, sealed contents of the given file.
 * @throws {ENOENT} If the given file is not found.
 */
export default function loadConstYaml(filePath) {
    return Object.seal(yaml.safeLoad(fs.readFileSync(`${filePath}.yaml`)));
}
