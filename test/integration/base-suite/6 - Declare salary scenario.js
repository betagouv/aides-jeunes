description: 'Declare salary.',

steps: [
    ResourcesComponent.hasSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setMonthlyValueInput(1101.42),
    ResourcesComponent.submit(),
    {
        'RecapComponent.revenue': /Salaire/,
    },
]
