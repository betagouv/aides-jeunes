const expect = require("expect")
const benefits = require("../../data/all")

const generator = require("../../data/benefits/aides-velo-generator.js")

describe("aides velo benefit generator", function () {
  xit("maps all benefits to existing institutions", function () {
    const list = generator(Object.values(benefits.institutionsMap))
    const missingInstitutionBenefits = list.filter((b) => !b.institution)

    const missingCommune = missingInstitutionBenefits.filter(
      (b) => b.collectivity.kind === "code insee"
    )
    console.log(missingCommune.map((b) => b.description).join("\n"))
    /*    expect(
      missingCommune
    ).toEqual([])*/

    const missingEPCI = missingInstitutionBenefits.filter(
      (b) => b.collectivity.kind === "epci"
    )
    console.log(missingEPCI.map((b) => b.description).join("\n"))
    if (missingEPCI.length) {
      var epci = require("@etalab/decoupage-administratif/data/epci.json")

      missingEPCI.forEach((b) => {
        const EPCIMatch = epci.find((e) =>
          e.nom.match(new RegExp(b.collectivity.value.replace("’", "'"), "i"))
        )
        b.debug = `publicId: '${EPCIMatch?.code}'`
      })
    }
    expect(missingEPCI).toEqual([])
  })
})
