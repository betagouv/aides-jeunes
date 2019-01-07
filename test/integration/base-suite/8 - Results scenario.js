description: 'Get results',

steps: [
    {
        'ResultComponent.title': /Résultats/,
    },
    {
        'ResultComponent.prestationName': PRESTATION_NAME,
        'ResultComponent.prestationMontant': /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/,
        'ResultComponent.declareYM2ResourcesLink': false,
    },
    {
        'ResultComponent.prestationDescription': PRESTATION_DESCRIPTION,
        'ResultComponent.prestationMoreInfoLink': true,
        'ResultComponent.prestationYM2Warning': HAS_PRESTATION_WARNING,
    },
]
