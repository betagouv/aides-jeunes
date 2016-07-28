description: 'Declare being locataire.',

steps: [
    {
        'LogementFormComponent.title': /logement/,
    },
    LogementFormComponent.declareLocataire(),
    LogementFormComponent.declareLogementIsNotColocation(),
    LogementFormComponent.declareProprietaireNotInFamily(),
    LogementFormComponent.declareLogementIsNotMeuble(),
    LogementFormComponent.declareLogementIsNotChambre(),
    LogementFormComponent.setLoyerInput('600'),
    LogementFormComponent.setChargesInput('500'),
    LogementFormComponent.setZipCodeInput('61500'),
    LogementFormComponent.submit(),
    {
        'RecapComponent.housingStatus': 'Locataire',
    },
]
