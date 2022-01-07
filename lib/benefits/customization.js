function determineCustomizationIds(testCase) {
  if (testCase.menage && testCase.menage && testCase.menage._departement) {
    const metropole =
      testCase.menage._epciType && testCase.menage._epciType.startsWith("MET")
        ? `M${testCase.menage._epci}`
        : undefined
    return [`D${testCase.menage._departement}`, metropole]
  }
  return undefined
}

module.exports = determineCustomizationIds
