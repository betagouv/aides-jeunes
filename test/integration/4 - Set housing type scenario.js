description: 'Housing type should be settable',

steps: [
    HousingComponent.setHostedType(),
    HousingComponent.submit(),
    {
        'SituationComponent.json': /"statut_occupation":"6"/,
    },
]
