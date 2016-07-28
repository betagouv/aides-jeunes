description: 'Declare family income.',

steps: [
    ResourcesComponent.submit(), // No resource for the conjoint
    ResourcesComponent.declareFirstChildHasIncome(),
    ResourcesComponent.submit(),
    ResourcesComponent.declareRevenuActivite(),
    ResourcesComponent.checkSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setThirdMonthInput(400),
    ResourcesComponent.setLast12MonthsInput(400),
    ResourcesComponent.submit(),
]
