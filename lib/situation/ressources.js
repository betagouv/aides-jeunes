// http://vosdroits.service-public.fr/particuliers/F24585.xhtml

module.exports = {
    // Revenus d'activité
    'revenusSalarie': { name: 'revenusSalarie', label: 'Salaires', section: 'revenusActivite' },
    'revenusNonSalarie': { name: 'revenusNonSalarie', label: 'Revenus non-salarié',  section: 'revenusActivite' },
    'revenusAutoEntrepreneur': { name: 'revenusAutoEntrepreneur', label: 'Revenus auto-entrepreneur', section: 'revenusActivite' },

    // Prestations sociales
    'allocationsChomage': { name: 'allocationsChomage', label: 'Chômage', section: 'allocations' },
    'allocationLogement': { name: 'allocationLogement', label: 'Logement', section: 'allocations' },
    'rsa': { name: 'rsa', label: 'Revenu de Solidarité Active', section: 'allocations' },
    'aspa': { name: 'aspa', label: 'Solidarité aux personnes âgées', section: 'allocations' },
    'ass': { name: 'ass', label: 'Solidarité spécifique', section: 'allocations' },

    // Indemnités
    // indemnités de volontariat
    'indJourMaternite': { name: 'indJourMaternite', label: 'Maternité',  section: 'indemnites' },
    'indJourPaternite': { name: 'indJourPaternite', label: 'Paternité', section: 'indemnites' },
    'indJourAdoption': { name: 'indJourAdoption', label: 'Adoption', section: 'indemnites' },
    'indJourMaladie': { name: 'indJourMaladie', label: 'Maladie', section: 'indemnites' },
    'indJourMaladieProf': { name: 'indJourMaladieProf', label: 'Maladie professionnelle', section: 'indemnites' },
    'indJourAccidentDuTravail': { name: 'indJourAccidentDuTravail', label: 'Accident du travail', section: 'indemnites' },
    'indChomagePartiel': { name: 'indChomagePartiel', label: 'Chômage partiel', section: 'indemnites' },

    // Allocations, pensions
    'pensionsAlimentaires': { name: 'pensionsAlimentaires', label: 'Alimentaires', section: 'pensions' },
    'pensionsRetraitesRentes': { name: 'pensionsRetraitesRentes', label: 'Retraites, rentes', section: 'pensions' }

    // allocation journalière d'accompagnement d'une personne en fin de vie
    // dédommagement versé aux victimes de l'amiante
    // libéralités
    // prestation compensatoire
    // ressources exceptionnelles (vente d'une maison, héritage, gains aux jeux, ...)
    // capitaux placés (hors compte courant rémunéré) : livret A, livret d'épargne populaire, compte ou plan épargne logement, ...)
    // rente d'orphelin
    // certaines prestations familiales, notamment les allocations familiales, le complément familial, le complément de libre choix d'activité, l'allocation de soutien familial
    // allocation aux adultes handicapés (AAH) et ses compléments
    // prime forfaitaire mensuelle pour reprise d'activité
    // loyers d'un bien immobilier loué
    // valeur locative d'un logement, local ou terrain non loué (évaluée selon l'avis d'imposition de la taxe d'habitation ou à défaut de la taxe foncière)
    // allocation d'entretien perçue de la part de l'aide sociale à l'enfance en tant que tiers digne de confiance
};
