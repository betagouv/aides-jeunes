var _ = require('lodash');

function logementEligible(logement) {
    switch (logement.get('statusOccupation')) {
        case 'gratuit':
            return false;
        case 'locataire':
            return !logement.get('prochePropriétaire');
        case 'proprietaire':
            return logement.get('prêtEnCours');
    }
}

function estEligibleAideLogement(demandeur) {
    var logement = demandeur.get('logement');
    if (!logement) return false;
    return !!(logementEligible(logement) && logement.get('loyer') && logement.get('codePostal'));
}

exports.estEligibleAideLogement = estEligibleAideLogement;
