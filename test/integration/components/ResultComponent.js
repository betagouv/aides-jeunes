title: 'h1',

prestationName: '.droits-list--eligible [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + PRESTATION_TO_TEST_POSITION + ') [itemprop="name"]',
prestationMontant: '.droits-list--eligible [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + PRESTATION_TO_TEST_POSITION + ') [itemprop="offers"]',
prestationWarning: '#' + PRESTATION_ID + ' .alert-warning',
declareYM2ResourcesLink: '#' + PRESTATION_ID + ' .btn-warning',
prestationDescription: '#' + PRESTATION_ID + ' [itemprop="description"]',
prestationMoreInfoLink: '#' + PRESTATION_ID + ' [itemprop="termsOfService"]',

openPrimeActiviteLink: { a: 'Prime d’activité' },
requestPrimeActiviteLink: { a: 'Faire une demande' },

greyedPrestation: '.droits-eligibles .needs-n-2',
