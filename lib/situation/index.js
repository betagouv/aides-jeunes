/*
** Module dependencies
*/
var _ = require('lodash');
var _s = require('underscore.string');
var moment = require('moment');

var status = require('./status');
var ressources = require('./ressources');


/*
** Helpers
*/
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

    function instanciateAll(entityType) {
        return function(entity, key, collection) {
            if (entity instanceof entityType) return;
            collection[key] = new entityType(entity);
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
function Individu(individu) {
    if (individu) _.assign(this, individu);
    if (!this.id) this.id = _.uniqueId('ind_');
    if (!this.ressources) this.ressources = {};
}

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

Individu.prototype.enCouple = function(statusMarital, conjoint) {
    conjoint = conjoint || new Individu();
    couple(this, conjoint, statusMarital);
};

Individu.prototype.seul = function() {
    seul(this, this.conjoint);
};

Individu.prototype.getÂge = function() {
    return moment().diff(this.get('dateDeNaissance'), 'years');
};

Individu.prototype.getParentIsolé = function() {
    if (this.get('statusMarital') !== 'seul') return false;
    else return this.get('nbEnfants') > 0 || this.get('enceinte');
};

Individu.prototype.getNbEnfants = function() {
    return this.get('enfants').length;
};

Individu.prototype.ressourcesTroisDerniersMois = function() {
    return _.map(troisDerniersMois(), function(periode) {
        if (!(period in this.ressources)) throw new ComputingError(['ressources'], this);
        return this.ressources[periode];
    }, this);
};

Individu.prototype.construitTroisDerniersMois = function() {
    _.forEach(troisDerniersMois(), function(periode) {
        if (!(periode in this.ressources)) this.ressources[periode] = {};
    }, this);
};

Individu.prototype.get = get;

Individu.status = status;
Individu.ressources = ressources;


/*
** Logement
*/
function Logement(logement) {
    if (logement) _.assign(this, logement);
    if (!this.id) this.id = _.uniqueId('log_');
}

Logement.prototype.ajouteOccupant = function(occupant) {
    occupant = occupant || new Individu();
    occupantLogement(occupant, this);
};

Logement.prototype.get = get;


/*
** Relations
*/
var relations = ['occupants', 'logement', 'parents', 'enfants', 'conjoint'];

function parentEnfant(parent, enfant, remove) {
    if (!remove) {
        if (!parent.enfants) parent.enfants = [];
        if (!enfant.parents) enfant.parents = [];
        parent.enfants.push(enfant);
        enfant.parents.push(parent);
    } else {
        if (parent.enfants) _.remove(parent.enfants, enfant);
        if (enfant.parents) _.remove(enfant.parents, parent);
    }
}

function occupantLogement(occupant, logement) {
    if (!logement.occupants) logement.occupants = [];
    occupant.logement = logement;
    logement.occupants.push(occupant);
}

function couple(conjoint1, conjoint2, statusMarital) {
    conjoint1.conjoint = conjoint2;
    conjoint2.conjoint = conjoint1;
    conjoint1.statusMarital = statusMarital;
    conjoint2.statusMarital = statusMarital;
}

function seul(conjoint1, conjoint2) {
    if (conjoint1) {
        delete conjoint1.conjoint;
        conjoint1.statusMarital = 'seul';
    }
    if (conjoint2) {
        delete conjoint2.conjoint;
        conjoint2.statusMarital = 'seul';
    }
}


/*
** Exports
*/
exports.Logement = Logement;
exports.Individu = Individu;
exports.expand = expand;
exports.flatten = flatten;
exports.ComputingError = ComputingError;
exports.troisDerniersMois = troisDerniersMois;
