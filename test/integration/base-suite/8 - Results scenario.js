description: 'Get results',

steps: [
    {
        'ResultComponent.firstPrestationName': FIRST_PRESTATION_NAME,
        'ResultComponent.firstPrestationMontant': /\d+ €/,
        'ResultComponent.firstPrestationMontantDetail': '/ mois',
        'ResultComponent.firstPrestationYM2Warning': HAS_FIRST_PRESTATION_WARNING,
        'ResultComponent.greyedPrestation': HAS_FIRST_PRESTATION_WARNING,
        'ResultComponent.declareYM2ResourcesLink': true,
    },
    ResultComponent.openFirstPrestationTab(),
    {
        'ResultComponent.firstPrestationDescription': FIRST_PRESTATION_DESCRIPTION,
        'ResultComponent.firstPrestationMoreInfoLink': true,
        'ResultComponent.firstPrestationEngagerDemarchesLink': HAS_ENGAGER_DEMARCHES_LINK,
    }

]

