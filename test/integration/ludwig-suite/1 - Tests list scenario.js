description: 'Tests should be visible',

steps: [
    {
        'LudwigComponent.testsCount': /\d{3,}/,
    },
    LudwigComponent.toggleFirstTest(),
    {
        'TestComponent.description'     : true,
        'TestComponent.testedAideName'  : true,
        'TestComponent.expectedValue'   : /(\d+ €|Oui|Non)/,
    },
    TestComponent.checkRecapSituationContains('dateDeValeur'),
]
