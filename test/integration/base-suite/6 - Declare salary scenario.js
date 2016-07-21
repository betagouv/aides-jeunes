description: 'Declare salary.',

steps: [
    ResourcesComponent.declareResources(),
    ResourcesComponent.declareRevenuActivite(),
    ResourcesComponent.checkSalary(),
    ResourcesComponent.submit(),
    ResourcesComponent.setFirstMonthInput(1000),
    ResourcesComponent.setSecondMonthInput(1000),
    ResourcesComponent.setThirdMonthInput(1000),
    ResourcesComponent.setLast12MonthsInput(12000),
    ResourcesComponent.submit(),
    RecapComponent.openSalaryTab(),
    {
        'RecapComponent.salaryFirstMonth': '1000 €',
        'RecapComponent.salaryLast12Months': '12000 €',
    },
]
