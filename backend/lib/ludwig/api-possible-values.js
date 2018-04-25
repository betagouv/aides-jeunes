module.exports = [
    {
        'id':'cmu_c',
        'hasMontant':false,
        'shortLabel':'CMU-C',
    },
    {
        'id':'acs',
        'shortLabel':'ACS',
    },
    {
        'hasMontant':false,
        'id': 'apa_eligibilite',
        'shortLabel': 'APA - Éligibilité',
    },
    {
        'id':'aspa',
        'shortLabel':'ASPA',
    },
    {
        'id':'asi',
        'shortLabel':'ASI',
    },
    {
        'id':'af',
        'shortLabel':'AF',
    },
    {
        'id':'cf',
        'shortLabel':'CF',
    },
    {
        'id':'asf',
        'shortLabel':'ASF',
    },
    {
        'id':'paje_base',
        'shortLabel':'PAJE-BASE',
    },
    {
        'id':'rsa',
        'shortLabel':'RSA',
        'uncomputabilityReasons': {
            'tns': 'le demandeur a des revenus en tant qu’indépendant',
            'conjoint_tns': 'le conjoint du demandeur a des revenus en tant qu’indépendant'
        }
    },
    {
        'id':'aide_logement',
        'shortLabel':'AL',
        'uncomputabilityReasons': {
            'primo_accedant': 'le demandeur est primo-accédant',
            'locataire_foyer': 'le demandeur loge dans un foyer'
        }
    },
    {
        'id':'ass',
        'shortLabel':'ASS',
    },
    {
        'id':'bourse_college',
        'shortLabel':'Bourse collège',
    },
    {
        'id':'bourse_lycee',
        'shortLabel':'Bourse lycée',
    },
    {
        'id':'paris_logement_familles',
        'shortLabel':'PLF'
    },
    {
        'id': 'paris_forfait_famille',
        'shortLabel': 'PFF'
    },
    {
        'id': 'paris_logement_psol',
        'shortLabel': 'PSOL'
    },
    {
        'id': 'paris_logement',
        'shortLabel': 'PL'
    },
    {
        'id': 'paris_logement_aspeh',
        'shortLabel': 'ASPEH'
    },
    {
        'id': 'paris_logement_plfm',
        'shortLabel': 'PLFM'
    },
    {
        'id': 'paris_energie_famille',
        'shortLabel': 'PEF'
    },
    {
        'id': 'paris_complement_sante',
        'shortLabel': 'CSP'
    },
    {
        'id': 'aah',
        'shortLabel': 'AAH',
    },
    {
        'id': 'caah',
        'shortLabel': 'CAAH',
    },
    {
       'id': 'ppa',
       'shortLabel': 'PPA',
    },
    {
        'id': 'rennes_metropole_transport',
        'shortLabel': 'Rennes - Transport',
        'unit': '%',
    },
    {
        'id': 'brest_metropole_transport',
        'shortLabel': 'Brest - Transport',
        'unit': '%',
    },
];
