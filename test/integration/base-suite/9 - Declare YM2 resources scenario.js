description: 'Declare YM2 resources',

steps: [
    ResultComponent.declareYM2Resources(),
    YM2ResourcesComponent.setDemandeurRevenuActiviteInput(-1000),
    YM2ResourcesComponent.submit(),
    {
        'YM2ResourcesComponent.errorMessage': /Montant invalide/,
        'YM2ResourcesComponent.globalErrorMessage': /est invalide/,
    },
    YM2ResourcesComponent.setDemandeurRevenuActiviteInput(12000),
    YM2ResourcesComponent.submit(),
    {
        'ResultComponent.declareYM2ResourcesLink': false,
    },
    {
        'ResultComponent.title': /Résultats/,
    },
    {
        'ResultComponent.resultatFrame': true,
    },
]

