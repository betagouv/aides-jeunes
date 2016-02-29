description: 'Housing type should be settable',

steps: [
    HousingComponent.setHostedType(),
    QuestionComponent.submit(),
    {
        'SituationComponent.json': /"statut_occupation":"6"/,
    },
]
