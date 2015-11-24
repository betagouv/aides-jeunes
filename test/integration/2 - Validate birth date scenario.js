description: 'Birth date should be validated',

steps: [
    HomepageComponent.start(),
    {
        'BirthDateComponent.title': BIRTHDATE_TITLE,
    },
    BirthDateComponent.setBirthDateField(BIRTHDATE + 'invalid'),
    BirthDateComponent.submit(),
    {
        'BirthDateComponent.title': BIRTHDATE_TITLE,
        'BirthDateComponent.error': true,
    },
]
