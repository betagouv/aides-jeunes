description: 'Results should be visible',

scenario: [
    HomepageWidget.start(),
    SituationWidget.submit(),
    {
        'ResultsWidget.title'    : true,
        'ResultsWidget.someAide' : /\w+/,
        'ResultsWidget.error'    : false,
    }
]
