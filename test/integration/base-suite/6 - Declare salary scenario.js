description: 'Declare salary.',

steps: [
    ResourcesComponent.hasSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setEarlier9MonthsInput(9000),
    ResourcesComponent.setFirstMonthInput(1000),
    ResourcesComponent.setSecondMonthInput(1000),
    ResourcesComponent.setThirdMonthInput(1000),
    ResourcesComponent.submit(),
    {
        'RecapComponent.revenue': /Salaire/,
    },
]
