'use strict';

const logementTypes = [
    {
        id: 'locataire',
        label: 'locataire',
        hint: 'Figurant sur le bail ou en foyer ou en résidence'
    },
    {
        id: 'proprietaire',
        label: 'propriétaire',
        hint: 'Ou en location-accession'
    },
    {
        id: 'heberge',
        label: 'hébergé',
        hint: 'Chez un particulier ou en logement de fonction'
    },
    {
        id: 'sansDomicile',
        label: 'sans domicile stable',
        hint: 'Ou domiciliation administrative'
    }
]

const locationTypes = [
    {
        id: 'nonmeuble',
        label: 'non meublé'
    },
    {
        id: 'meublehotel',
        label: 'meublé / hôtel'
    },
    {
        id: 'foyer',
        label: 'Foyer (résidence universitaire, maison de retraite, foyer de jeune travailleur, résidence sociale…)'
    }
]

const loyerLabels = {
    locataire: 'Votre loyer',
    proprietaire: 'Montant des mensualités'
}

module.exports = {
    logementTypes,
    locationTypes,
    loyerLabels,
}
