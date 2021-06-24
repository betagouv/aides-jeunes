const epci = require("@etalab/decoupage-administratif/data/epci.json").filter(
  (value) => value.type.startsWith("MET")
)

function determineCustomizationIds(testCase, currentPeriod) {
  if (
    testCase.menages &&
    testCase.menages._ &&
    testCase.menages._.depcom &&
    testCase.menages._.depcom[currentPeriod]
  ) {
    const metropole = epci.filter(
      (value) =>
        value.membres &&
        value.membres.some(
          (membre) => membre.code === testCase.menages._.depcom[currentPeriod]
        )
    )[0]

    return [
      `D${testCase.menages._.depcom[currentPeriod].substring(
        0,
        testCase.menages._.depcom[currentPeriod].match(/^97/) ? 3 : 2
      )}`,
      metropole && `M${metropole.code}`,
    ]
  }

  return undefined
}

module.exports = determineCustomizationIds
