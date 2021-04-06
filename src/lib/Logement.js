function getStatutOccupationLogement(logement) {
    let statusOccupationMap = {
        proprietaireprimoaccedant: 'primo_accedant',
        proprietaire: 'proprietaire',
        locatairenonmeuble: 'locataire_vide',
        locatairemeublehotel: 'locataire_meuble',
        heberge: 'loge_gratuitement',
        locatairefoyer: 'locataire_foyer',
        sansDomicile : 'sans_domicile'
    };
    let statusOccupationId = logement.type;
    if (logement.type == 'proprietaire' && logement.primoAccedant) {
        statusOccupationId = 'proprietaireprimoaccedant';
    } else if (logement.type == 'locataire' && logement.locationType) {
        statusOccupationId += logement.locationType;
    }
    return statusOccupationMap[statusOccupationId];
}

function getLogementVariables(statusOccupationId) {
    let baseLogementMap = {
        primo_accedant:
            { type: 'proprietaire', primoAccedant: true },
        proprietaire:
            { type: 'proprietaire', primoAccedant: false },
        locataire_vide:
            { type: 'locataire', locationType: 'nonmeuble' },
        locataire_meuble:
            { type: 'locataire', locationType: 'meublehotel' },
        loge_gratuitement:
            { type: 'heberge' },
        locataire_foyer:
            { type: 'locataire', locationType: 'foyer' },
        sans_domicile:
            { type: 'sansDomicile' },
    }
    let base = statusOccupationId && baseLogementMap[statusOccupationId]
    return { type: null, primoAccedant: null, locationType: null, ...base }
}

const Logement = {
    getLogementVariables,
    getStatutOccupationLogement,
}

export default Logement
