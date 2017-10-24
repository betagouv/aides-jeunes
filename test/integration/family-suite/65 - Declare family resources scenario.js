description: 'Declare family income.',

steps: [
    ResourcesComponent.submit(), // No resource for the conjoint
    ResourcesComponent.declareFirstChildHasIncome(),
    ResourcesComponent.submit(),
    ResourcesComponent.hasSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.detailed(),
    ResourcesComponent.setThirdMonthInput(400),
    ResourcesComponent.setLast12MonthsInput(200),
    ResourcesComponent.submit(),
    {
        'ResourcesComponent.errorMessage': /Vous avez indiqué/,
    },
    ResourcesComponent.setLast12MonthsInput(400),
    ResourcesComponent.submit(),
]
