description: 'Declare salary.',

steps: [
    ResourcesComponent.hasSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setFirstMonthInput(1000),
    ResourcesComponent.setSecondMonthInput('°'),
    ResourcesComponent.setSecondMonthInput(''),
    ResourcesComponent.setThirdMonthInput(1000),
    ResourcesComponent.setLast12MonthsInput(1000),
    ResourcesComponent.submit(),
    {
        'ResourcesComponent.errorMessage': /La somme/,
    },
    ResourcesComponent.setLast12MonthsInput(12000),
    ResourcesComponent.submit(),
    {
        'RecapComponent.revenue': /Salaire/,
    },
]
