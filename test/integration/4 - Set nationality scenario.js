description: 'Nationality should be settable',

steps: [
    NationalityComponent.setFrench(),
    QuestionComponent.submit(),
    {
        'SituationComponent.json': /"ressortissant_eee":true/,
    },
]
