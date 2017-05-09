description: 'Declare salary.',

steps: [
    ResourcesComponent.hasSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setFirstMonthInput(1000),
    ResourcesComponent.setSecondMonthInput(1000),
    ResourcesComponent.setThirdMonthInput(1000),
    ResourcesComponent.setLast12MonthsInput(1000),
    ResourcesComponent.submit(),
    {
        'ResourcesComponent.errorMessage': /Le total d/,
    },
    ResourcesComponent.setLast12MonthsInput(12000),
    ResourcesComponent.submit(),
    {
        'RecapComponent.revenue': /Salaire/,
    },
]
