var _ = require('lodash');

exports['al.zone'] = {
    required: ['demandeur.ville'],
    getValue: function(ville) {
        return this.respond(2);
    }
};

exports['al.éligibilitéLogement'] = {
    required: ['demandeur.situationLogement'],
    optional: ['logement.parentPropriétaireLogementLoué', 'logement.emprunt'],
    getValue: function(situationLogement, parentPropriétaireLogementLoué, emprunt) {
        if (situationLogement === 'propriétaire') {
            if (_.isUndefined(emprunt)) return this.claim('logement.emprunt');
            return emprunt;
        } else if (situationLogement === 'locataire') {
            if (_.isUndefined(parentPropriétaireLogementLoué)) return this.claim('logement.parentPropriétaireLogementLoué');
            return this.respond(!parentPropriétaireLogementLoué);
        } else {
            return this.respond(false);
        }
    }
};

exports['al.éligibilité'] = {
    required: ['al.éligibilitéLogement'],
    optional: ['logement.loyer'],
    getValue: function(éligibilitéLogement, loyer) {
        if (!éligibilitéLogement) return false;
        if (_.isUndefined(loyer)) return this.claim('logement.loyer');
        if (loyer > 0) return true;
    }
};
