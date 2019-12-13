var entityGroups = {
    individus: [],
    familles: ['parents', 'enfants'],
    foyers_fiscaux: ['declarants', 'personnes_a_charge'],
    menages: ['personne_de_reference', 'conjoint', 'enfants']
};

function init() {
    var result = Object.keys(entityGroups).reduce((accum, entityName) => {
        accum[entityName] = {};
        return accum;
    }, {});
    result['individus'] = {};

    return result;
}

function prefix(prefix, situation) {
    Object.keys(entityGroups).forEach(entityName => {
        var oldKeys = Object.keys(situation[entityName]);
        oldKeys.forEach(name => {
            situation[entityName][prefix + name] = situation[entityName][name];
            delete situation[entityName][name];
        });

        entityGroups[entityName].forEach(property => {
            Object.keys(situation[entityName]).forEach(id => {
                let entity = situation[entityName][id];

                if (entity[property]) {
                    entity[property] =  entity[property].map(id => prefix + id);
                }
            });
        });
    });

    return situation;
}

function append(acummulator, situation) {
    Object.keys(entityGroups).forEach(entityName => {
        Object.keys(situation[entityName]).forEach(id => {
            acummulator[entityName][id] = situation[entityName][id];
        });
    });

    return acummulator;
}

module.exports = {
    init,
    prefix,
    append
};
