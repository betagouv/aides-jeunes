description: 'Declare being SDS.',

steps: [
    {
        'LogementFormComponent.title': /logement/,
    },
    LogementFormComponent.declareSDS(),
    {
        'LogementFormComponent.zipCodeInput': true,
    },
    LogementFormComponent.setZipCodeInput('61500'),
    {
        'LogementFormComponent.city': /AUNAY/i,
    },
    LogementFormComponent.submit(),
    {
        'RecapComponent.housingStatus': 'Sans domicile stable',
    },
]
