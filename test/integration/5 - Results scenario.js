description: 'Results should be visible',

steps: [
    SituationComponent.submit(),
    {
        'ResultsComponent.title'    : new RegExp(AIDES_COUNT),
        'ResultsComponent.someAide' : /\w+/,
        'ResultsComponent.error'    : false,
    }
]
