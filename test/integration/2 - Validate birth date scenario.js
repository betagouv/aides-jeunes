description: 'Birth date should be validated',

steps: [
    HomepageComponent.start(),
    {
        'QuestionComponent.title': BIRTHDATE_TITLE,
    },
    QuestionComponent.submit(),
    {
        'QuestionComponent.title': BIRTHDATE_TITLE,  // test that we didn't change page, don't test error message itself as some browsers will prevent submitting altogether
    },
    QuestionComponent.setInputField(BIRTHDATE + 'invalid'),
    QuestionComponent.submit(),
    {
        'QuestionComponent.invalidError': /non reconnu/,
    },
]
