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
]

