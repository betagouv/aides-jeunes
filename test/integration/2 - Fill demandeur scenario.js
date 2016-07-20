description: 'Fill the "Demandeur" form.',

steps: [
    HomepageComponent.start(),
    {
        'IndividualFormComponent.birthDateInput': true
    },
    IndividualFormComponent.setBirthDateInput('21/01/1981'),
    IndividualFormComponent.submit(),
    {
        'RecapComponent.firstPersonBirthdate': '21 janvier 1981'
    }
]
