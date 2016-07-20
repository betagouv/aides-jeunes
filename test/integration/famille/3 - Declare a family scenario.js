description: 'Declare a family with 2 parents and 2 children.',

steps: [
    EnfantsFormComponent.addChild(),
    IndividualFormComponent.setBirthDateInput('01/04/2010'),
    IndividualFormComponent.setFirstNameInput('Alice'),
    IndividualFormComponent.submit(),

    EnfantsFormComponent.addChild(),
    IndividualFormComponent.setBirthDateInput('01/08/2012'),
    IndividualFormComponent.setFirstNameInput('Bob'),
    IndividualFormComponent.submit(),
    EnfantsFormComponent.submit(),

    ConjointFormComponent.declareCouple(),
    IndividualFormComponent.setBirthDateInput('04/05/1979'),
    IndividualFormComponent.submit(),

    {
        'RecapComponent.firstPersonBirthdate': '21 janvier 1981',
        'RecapComponent.secondPersonBirthdate': '1 avril 2010',
        'RecapComponent.thirdPersonBirthdate': '1 août 2012',
        'RecapComponent.fourthPersonBirthdate': '4 mai 1979',
    }
]
