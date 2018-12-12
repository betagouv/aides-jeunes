title: 'h1',

prestationName: '.droits-eligibles-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + PRESTATION_TO_TEST_POSITION + ') [itemprop="name"]',
prestationMontant: '.droits-eligibles-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + PRESTATION_TO_TEST_POSITION + ') [itemprop="offers"]',
prestationYM2Warning: '#' + PRESTATION_ID + ' .alert-warning',
prestationDescription: '#' + PRESTATION_ID + ' [itemprop="description"]',
prestationMoreInfoLink: '#' + PRESTATION_ID + ' [itemprop="termsOfService"]',

openPrimeActiviteLink: { a: 'Prime d’activité' },
requestPrimeActiviteLink: { a: 'Faire une demande' },

greyedPrestation: '.droits-eligibles .needs-n-2',
declareYM2ResourcesLink: { a: 'Déclarez vos ressources' },
