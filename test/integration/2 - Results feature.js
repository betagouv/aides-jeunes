description: 'Results should be visible',

scenario: [
    HomepageWidget.start(),
    SituationWidget.submit(),
    {
        'ResultsWidget.title'    : true,
        'ResultsWidget.someAide' : true,
        'ResultsWidget.error'    : false,
    }
]
