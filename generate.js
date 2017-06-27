
var _ = require('lodash');
var droitsDescription = require('./app/js/constants/droits');

var structuredPrestations = _.values(droitsDescription).map(function(level) {
    return _.values(level).map(function(provider) {
        return _.values(_.mapValues(provider.prestations, function(prestation, prestationName) {
            var prestations = {};
            prestations[prestationName] = _.assign({}, prestation);
            if (prestation.uncomputability)
                prestations[prestationName + '_non_calculable'] = _.assign({}, prestation, { type: 'string' });
            return prestations;
        }));
    });
});

var prestations = _.chain(structuredPrestations).flatten().flatten().value()
    .reduce(function(obj, accum) { return _.assign(accum, obj); } , {});

console.log(prestations);
