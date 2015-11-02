description: 'Results should be visible',

scenario: [
    HomepageWidget.start(),
    SituationWidget.submit(),
    {
        'ResultsWidget.title'    : new RegExp(AIDES_COUNT),
        'ResultsWidget.someAide' : /\w+/,
        'ResultsWidget.error'    : false,
    }
]
