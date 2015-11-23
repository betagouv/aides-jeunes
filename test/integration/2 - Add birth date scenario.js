description: 'Birth date should be settable',

steps: [
    HomepageComponent.start(),
    {
        'AgeComponent.title': true,
    },
    AgeComponent.setBirthDateField("01/04/1980"),
    AgeComponent.submit(),
    {
        'SituationComponent.json': /"birth":"1980-04-01"/,
    }
]
