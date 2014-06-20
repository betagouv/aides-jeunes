/*
** Module dependencies
*/
var _ = require('lodash');
var _s = require('underscore.string');
var moment = require('moment');

var statut = require('./status');
var ressources = require('./ressources');

var Individu, Logement, relations, parentEnfant, couple, seul, occupantLogement;

/*
** Helpers
*/
function generateId(prefix) {
    // TODO: Fix possible collision in a same situation
    return prefix + Math.floor(Math.random() * 10000);
}

function flatten(entity) {
    var individus = {};
    var logements = {};
    var startId = entity.id;

    function collectByType(entity) {
        if (_.isArray(entity)) return _.forEach(entity, function(eachEntity) { collectByType(eachEntity); });
        if ((entity.id in individus) || (entity.id in logements)) return;
        if (entity instanceof Individu) individus[entity.id] = entity;
        if (entity instanceof Logement) logements[entity.id] = entity;
        _.forEach(relations, function(relationName) {
            if (entity[relationName]) collectByType(entity[relationName]);
        });
    }
    collectByType(entity);

    function flattenEntity(entity, key, collection) {
        var clone = _.clone(entity);
        _.forEach(relations, function(relationName) {
            if (!entity[relationName]) return;
            clone[relationName] = _.isArray(entity[relationName]) ? _.pluck(entity[relationName], 'id') : entity[relationName].id;
        });
        collection[key] = clone;
    }

    _.forEach(individus, flattenEntity);
    _.forEach(logements, flattenEntity);

    return { individus: _.values(individus), logements: _.values(logements), startId: startId };
}

function expand(groupedEntities) {
    var startId = groupedEntities.startId;

    function instanciateAll(EntityType) {
        return function(entity, key, collection) {
            if (entity instanceof EntityType) return;
            collection[key] = new EntityType(entity);
        };
    }

    _.forEach(groupedEntities.logements, instanciateAll(Logement));
    _.forEach(groupedEntities.individus, instanciateAll(Individu));

    var entities = _.indexBy(_.union(groupedEntities.logements, groupedEntities.individus), 'id');

    _.forEach(entities, function(e) {
        _.forEach(relations, function(relationName) {
            if (!e[relationName]) return;
            e[relationName] = _.isArray(e[relationName]) ? _.values(_.pick(entities, e[relationName])) : entities[e[relationName]];
        });
    });

    return entities[startId];
}

function searchByEntityId(entity, entityId) {
    var entities = {};

    function collect(entity) {
        if (_.isArray(entity)) return _.forEach(entity, function(eachEntity) { collect(eachEntity); });
        if (entity.id in entities) return;
        entities[entity.id] = entity;
        _.forEach(relations, function(relationName) {
            if (entity[relationName]) collect(entity[relationName]);
        });
    }
    collect(entity);

    return entities[entityId];
}

function ComputingError(claimedAttributes, entity) {
    this.claimedAttributes = claimedAttributes;
    this.entity = entity;
}

function get(name) {
    if (name in this) return this[name];
    var getterName = 'get' + _s.capitalize(name);
    if ((getterName in this) && _.isFunction(this[getterName])) {
        var result = this[getterName]();
        this[name] =  result;
        return result;
    }
    throw new ComputingError([name], this);
}

function troisDerniersMois() {
    return _.map([3, 2, 1], function(nbMonths) {
        return moment().subtract(moment.duration(nbMonths, 'months')).format('YYYY-MM');
    });
}


/*
** Individu
*/
Individu = function Logement(individu) {
    if (individu) _.assign(this, individu);
    if (!this.id) this.id = generateId('ind-');
    if (!this.ressources) this.ressources = {};
};

Individu.prototype.ajouteEnfant = function(enfant) {
    enfant = enfant || new Individu();
    parentEnfant(this, enfant);
};

Individu.prototype.ajouteParent = function(parent) {
    parent = parent || new Individu();
    parentEnfant(parent, this);
};

Individu.prototype.retireEnfant = function(enfant) {
    if (!enfant) return;
    parentEnfant(this, enfant, true);
};

Individu.prototype.retireParent = function(parent) {
    if (!parent) return;
    parentEnfant(parent, this, true);
};

Individu.prototype.ajouteLogement = function(logement) {
    logement = logement || new Logement();
    occupantLogement(this, logement);
};

Individu.prototype.enCouple = function(statutMarital, conjoint) {
    conjoint = conjoint || new Individu();
    couple(this, conjoint, statutMarital);
};

Individu.prototype.seul = function() {
    seul(this, this.conjoint);
};

Individu.prototype.getAge = function() {
    return moment().diff(this.get('dateDeNaissance'), 'years');
};

Individu.prototype.getParentIsole = function() {
    if (this.get('statutMarital') !== 'seul') return false;
    else return this.get('nbEnfants') > 0 || this.get('enceinte');
};

Individu.prototype.getNbEnfants = function() {
    return this.get('enfants').length;
};

Individu.prototype.ressourcesTroisDerniersMois = function() {
    return _.map(troisDerniersMois(), function(periode) {
        if (!(periode in this.ressources)) throw new ComputingError(['ressources'], this);
        return this.ressources[periode];
    }, this);
};

Individu.prototype.construitTroisDerniersMois = function() {
    _.forEach(troisDerniersMois(), function(periode) {
        if (!(periode in this.ressources)) this.ressources[periode] = {};
    }, this);
};

Individu.prototype.get = get;

Individu.status = statut;
Individu.ressources = ressources;


/*
** Logement
*/
Logement = function Logement(logement) {
    if (logement) _.assign(this, logement);
    if (!this.id) this.id = generateId('log-');
};

Logement.prototype.ajouteOccupant = function(occupant) {
    occupant = occupant || new Individu();
    occupantLogement(occupant, this);
};

Logement.prototype.get = get;


/*
** Relations
*/
relations = ['occupants', 'logement', 'parents', 'enfants', 'conjoint'];

parentEnfant = function(parent, enfant, remove) {
    if (!remove) {
        if (!parent.enfants) parent.enfants = [];
        if (!enfant.parents) enfant.parents = [];
        parent.enfants.push(enfant);
        enfant.parents.push(parent);
    } else {
        if (parent.enfants) _.remove(parent.enfants, enfant);
        if (enfant.parents) _.remove(enfant.parents, parent);
    }
};

occupantLogement = function(occupant, logement) {
    if (!logement.occupants) logement.occupants = [];
    occupant.logement = logement;
    logement.occupants.push(occupant);
};

couple = function(conjoint1, conjoint2, statutMarital) {
    conjoint1.conjoint = conjoint2;
    conjoint2.conjoint = conjoint1;
    conjoint1.statutMarital = statutMarital;
    conjoint2.statutMarital = statutMarital;
};

seul = function(conjoint1, conjoint2) {
    if (conjoint1) {
        delete conjoint1.conjoint;
        conjoint1.statutMarital = 'seul';
    }
    if (conjoint2) {
        delete conjoint2.conjoint;
        conjoint2.statutMarital = 'seul';
    }
};


/*
** Exports
*/
exports.Logement = Logement;
exports.Individu = Individu;
exports.expand = expand;
exports.flatten = flatten;
exports.searchByEntityId = searchByEntityId;
exports.ComputingError = ComputingError;
exports.troisDerniersMois = troisDerniersMois;
