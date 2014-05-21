var _ = require('lodash');

function parentsFoyerRSA(demandeur) {
    return demandeur.get('statusMarital') !== 'seul' ? [demandeur, demandeur.get('conjoint')] : [demandeur];
}

function foyerRSA(demandeur) {
    var parents = parentsFoyerRSA(demandeur);
    var indexedEnfants = {};
    parents.forEach(function(parent) {
        parent.get('enfants').forEach(function(enfant) {
            indexedEnfants[enfant.id] = enfant;
        });
    });
    return { parents: parents, enfants: _.values(indexedEnfants) };
}

function estÉligibleRSA(demandeur) {
    var parents = parentsFoyerRSA(demandeur);
    return !!_.find(parents, function(parent) { return parent.get('âge') >= 25; }) || demandeur.get('parentIsolé');
}

exports.parentsFoyerRSA = parentsFoyerRSA;
exports.foyerRSA = foyerRSA;
exports.estÉligibleRSA = estÉligibleRSA;
