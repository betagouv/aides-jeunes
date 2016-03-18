description: 'Postal code should be settable',

steps: [
    QuestionComponent.submit(),
    {
        'QuestionComponent.title': POSTAL_CODE_TITLE,
    },
    QuestionComponent.setInputField(POSTAL_CODE_WITH_NO_MATCH),
    QuestionComponent.submit(),
    {
        'QuestionComponent.title': POSTAL_CODE_TITLE,
        'QuestionComponent.invalidError': /ne semble pas exister/,
    },
    QuestionComponent.setInputField(POSTAL_CODE_WITH_SINGLE_MATCH + '\n'),
    {
        'QuestionComponent.async': false,
    },
    QuestionComponent.submit(),
    {
        'QuestionComponent.invalidError': false,
        'SituationComponent.json': new RegExp('"depcom":"' + SINGLE_MATCH_INSEE_CODE + '"'),
    },
]
