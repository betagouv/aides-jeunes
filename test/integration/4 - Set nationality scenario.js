description: 'Nationality should be settable',

steps: [
    NationalityComponent.setFrench(),
    QuestionComponent.submit(),
    {
        'SituationComponent.additionalInformationJson': /"nationality":"fr"/,
    },
]
