description: 'Birth date should be settable',

steps: [
    QuestionComponent.setInputField(BIRTHDATE),
    QuestionComponent.submit(),
    {
        'SituationComponent.json': new RegExp('"birth":"' + BIRTHDATE_ISO + '"'),
    },
]
