description: 'Declare salary.',

steps: [
    ResourcesComponent.hasSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setMonthlyValueInput(1000),
    ResourcesComponent.submit(),
    {
        'RecapComponent.revenue': /Salaire/,
    },
]
