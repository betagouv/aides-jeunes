const expect = require("expect")
const benefits = require("../../data/all")

const generator = require("../../data/benefits/aides-velo-generator.js")

describe("aides velo benefit generator", function () {
  it("maps all benefits to existing institutions", function () {
    const list = generator(Object.values(benefits.institutionsMap))
    const missingInstitutionBenefits = list.filter((b) => !b.institution)

    expect(
      missingInstitutionBenefits.filter((b) => b.id.match(/insee/))
    ).toEqual([])

    const missingEPCI = missingInstitutionBenefits.filter((b) =>
      b.id.match(/epci/)
    )
    if (missingEPCI.length) {
      var epci = require("@etalab/decoupage-administratif/data/epci.json")

      missingEPCI.forEach((b) => {
        const EPCIMatch = epci.find((e) =>
          e.nom.match(new RegExp(b.collectivity.replace("’", "'"), "i"))
        )
        b.debug = `publicId: '${EPCIMatch?.code}'`
      })
    }
    expect(missingEPCI).toEqual([])
  })
})
