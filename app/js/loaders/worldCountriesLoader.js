const requireFromString = require('require-from-string');
const getOptions = require('loader-utils').getOptions;
const _ = require('lodash');

module.exports = function(source) {

    const options = getOptions(this);

    if (options.include) {

        let data = requireFromString(source, this.resourcePath);

        data = data.map((item) => _.pick(item, options.include));

        const value = JSON.stringify(data)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');

        return `module.exports = ${value}`;
    }

    return source;
};
