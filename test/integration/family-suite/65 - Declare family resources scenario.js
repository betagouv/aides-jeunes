description: 'Declare family income.',

steps: [
    ResourcesComponent.submit(), // No resource for the conjoint
    ResourcesComponent.declareFirstChildHasIncome(),
    ResourcesComponent.submit(),
    ResourcesComponent.hasSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setEarlier9MonthsInput(0),
    ResourcesComponent.setThirdMonthInput(400),
    ResourcesComponent.submit(),
]
