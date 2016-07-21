description: 'Declare a family with 2 parents and 2 children.',

steps: [
    EnfantsFormComponent.addChild(),
    IndividualFormComponent.setBirthDateInput(FIRST_CHILD_BIRTHDATE),
    IndividualFormComponent.setFirstNameInput('Alice'),
    IndividualFormComponent.submit(),

    EnfantsFormComponent.addChild(),
    IndividualFormComponent.setBirthDateInput(SECOND_CHILD_BIRTHDATE),
    IndividualFormComponent.setFirstNameInput('Bob'),
    IndividualFormComponent.submit(),
    EnfantsFormComponent.submit(),

    ConjointFormComponent.declareCouple(),
    IndividualFormComponent.setBirthDateInput(CONJOINT_BIRTHDATE),
    IndividualFormComponent.submit(),

    {
        'RecapComponent.firstPersonBirthdate': DEMANDEUR_BIRTHDATE_PLAIN_TEXT,
        'RecapComponent.secondPersonBirthdate': FIRST_CHILD_BIRTHDATE_PLAIN_TEXT,
        'RecapComponent.thirdPersonBirthdate': SECOND_CHILD_BIRTHDATE_PLAIN_TEXT,
        'RecapComponent.fourthPersonBirthdate': CONJOINT_BIRTHDATE_PLAIN_TEXT,
    }
]
