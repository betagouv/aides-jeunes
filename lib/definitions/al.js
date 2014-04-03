exports['al.éligibilitéLogement'] = {
    required: ['demandeur.situationLogement'],
    optional: ['logement.parentPropriétaireLogementLoué', 'logement.emprunt'],
    getValue: function(situationLogement, parentPropriétaireLogementLoué, emprunt) {
        if (situationLogement === 'propriétaire') {
            this.assumeDefined('logement.emprunt');
            return emprunt;
        } else if (situationLogement === 'locataire') {
            this.assumeDefined('logement.parentPropriétaireLogementLoué');
            return !parentPropriétaireLogementLoué;
        } else {
            return false;
        }
    }
};

exports['al.éligibilité'] = {
    required: ['al.éligibilitéLogement'],
    optional: ['logement.loyer', 'logement.codePostal'],
    getValue: function(éligibilitéLogement, loyer) {
        if (!éligibilitéLogement) return false;
        this.assumeDefined(['logement.codePostal', 'logement.loyer']);
        if (loyer > 0) return true;
    }
};
