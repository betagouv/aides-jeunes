description: 'Birth date should be settable',

steps: [
    BirthDateComponent.setBirthDateField(BIRTHDATE),
    BirthDateComponent.submit(),
    {
        'SituationComponent.json': new RegExp('"birth":"' + BIRTHDATE_ISO + '"'),
    },
]
