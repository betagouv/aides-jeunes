function logementEligible(logement) {
    switch (logement.get('statusOccupation')) {
        case 'gratuit':
            return false;
        case 'locataire':
            return !logement.get('procheProprietaire');
        case 'proprietaire':
            return logement.get('pretEnCours');
    }
}

function estEligibleAideLogement(demandeur) {
    var logement = demandeur.get('logement');
    if (!logement) return false;
    return !!(logementEligible(logement) && logement.get('loyer') && logement.get('codePostal'));
}

exports.estEligibleAideLogement = estEligibleAideLogement;
