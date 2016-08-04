description: 'Get results',

steps: [
    {
        'ResultComponent.title': /Résultats/,
        'ResultComponent.prestationName': PRESTATION_NAME,
        'ResultComponent.prestationMontant': /\d+ €/,
        'ResultComponent.prestationMontantDetail': '/ mois',
        'ResultComponent.prestationYM2Warning': HAS_PRESTATION_WARNING,
        'ResultComponent.greyedPrestation': HAS_PRESTATION_WARNING,
        'ResultComponent.declareYM2ResourcesLink': true,
    },
    ResultComponent.openPrestationTab(),
    {
        'ResultComponent.prestationDescription': PRESTATION_DESCRIPTION,
        'ResultComponent.prestationMoreInfoLink': true,
    }
]
