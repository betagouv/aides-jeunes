description: 'Fill the "Demandeur" form.',

steps: [
    HomepageComponent.start(),
    {
        'IndividualFormComponent.birthDateInput': true,
    },
    IndividualFormComponent.setBirthDateInput(DEMANDEUR_BIRTHDATE),
    IndividualFormComponent.submit(),
    {
        'RecapComponent.firstPersonBirthdate': DEMANDEUR_BIRTHDATE_PLAIN_TEXT,
    }
]
