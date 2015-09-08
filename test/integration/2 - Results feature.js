description: 'Results should be visible',

scenario: [
    HomepageWidget.start(),
    {
        'ResultsWidget.title' : true,
        'ResultsWidget.cmu'   : true,
        'ResultsWidget.error' : false,
    }
]
