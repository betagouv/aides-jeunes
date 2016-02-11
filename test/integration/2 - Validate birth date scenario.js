description: 'Birth date should be validated',

steps: [
    HomepageComponent.start(),
    {
        'BirthDateComponent.title': BIRTHDATE_TITLE,
    },
    BirthDateComponent.submit(),
    {
        'BirthDateComponent.title': BIRTHDATE_TITLE,  // test that we didn't change page, don't test error message itself as some browsers will prevent submitting altogether
    },
    BirthDateComponent.setBirthDateField(BIRTHDATE + 'invalid'),
    BirthDateComponent.submit(),
    {
        'BirthDateComponent.invalidError': /non reconnu/,
    },
]
