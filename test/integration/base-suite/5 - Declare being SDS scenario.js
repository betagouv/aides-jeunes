description: 'Declare being SDS.',

steps: [
    {
        'LogementFormComponent.title': /logement/,
    },
    LogementFormComponent.declareSDS(),
    {
        'LogementFormComponent.zipCodeInput': true,
    },
    LogementFormComponent.submit(),
    {
        'LogementFormComponent.errorMessage': /code postal est invalide/,
    },
    LogementFormComponent.setZipCodeInput('61509'),
    LogementFormComponent.submit(),
    {
        'LogementFormComponent.errorMessage': /code postal est invalide/,
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
