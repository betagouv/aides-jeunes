description: 'Continue scenario.',

steps: [
    HomepageComponent.continue(),
    {
        'IndividualFormComponent.birthDateInput': DEMANDEUR_BIRTHDATE,
    }
]
