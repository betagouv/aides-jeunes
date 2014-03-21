var _ = require('lodash');

module.exports = function(engine) {

    // TODO: Ajouter un service d'association ville/zone AL
    engine.registerDefinition('al.zone', {
        required: ['demandeur.ville'],
        getValue: function(ville) {
            return 2;
        }
    });

    engine.registerDefinition('al.éligibilitéLogement', {
        required: ['demandeur.situationLogement'],
        optional: ['logement.parentPropriétaireLogementLoué', 'logement.emprunt'],
        getValue: function(situationLogement, parentPropriétaireLogementLoué, emprunt) {
            if (situationLogement === 'propriétaire') {
                if (_.isUndefined(emprunt)) return this.claim('logement.emprunt');
                return emprunt;
            } else if (situationLogement === 'locataire') {
                if (_.isUndefined(parentPropriétaireLogementLoué)) return this.claim('logement.parentPropriétaireLogementLoué');
                return !parentPropriétaireLogementLoué;
            } else {
                return false;
            }
        }
    });

    engine.registerDefinition('al.éligibilité', {
        required: ['al.éligibilitéLogement'],
        getValue: function(éligibilitéLogement) {
            return éligibilitéLogement;
        }
    });

};
