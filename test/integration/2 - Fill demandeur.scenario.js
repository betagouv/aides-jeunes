description: 'Fill the "Demandeur" form.',

steps: [
    HomepageComponent.start(),
    {
        'DemandeurFormComponent.birthDateInput': true
    },
    DemandeurFormComponent.setBirthDateInput('21/01/1981'),
    DemandeurFormComponent.submit(),
    {
        'DemandeurFormComponent.birthDateRecapitulatif': '21 janvier 1981'
    }
]
