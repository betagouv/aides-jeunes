description: 'Birth date should be settable',

steps: [
    HomepageComponent.start(),
    {
        'BirthDateComponent.title': true,
    },
    BirthDateComponent.setBirthDateField("01/04/1980"),
    BirthDateComponent.submit(),
    {
        'SituationComponent.json': /"birth":"1980-04-01"/,
    }
]
