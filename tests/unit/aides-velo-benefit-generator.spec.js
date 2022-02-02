const expect = require("expect")
const benefits = require("../../data/all")

const generator = require("../../data/benefits/aides-velo-generator.js")

describe("aides velo benefit generator", function () {
  const list = generator(Object.values(benefits.institutionsMap))

  list.forEach((benefit) => {
    it("generates simple benefit ids", function () {
      expect(benefit.id).toMatch(/^[0-9a-zA-Z_éàèçâ-]+$/)
    })
  })

  it("maps all benefits to existing institutions", function () {
    const missingInstitutionBenefits = list.filter((b) => !b.institution)

    const missingCommune = missingInstitutionBenefits.filter(
      (b) => b.collectivity.kind === "code insee"
    )
    if (missingCommune.length) {
      console.log(missingCommune.map((b) => b.description).join("\n"))
    }

    const missingEPCI = missingInstitutionBenefits.filter(
      (b) => b.collectivity.kind === "epci"
    )
    if (missingEPCI.length) {
      var epci = require("@etalab/decoupage-administratif/data/epci.json")

      missingEPCI.forEach((b) => {
        const EPCIMatch = epci.find((e) =>
          e.nom.match(new RegExp(b.collectivity.value.replace("’", "'"), "i"))
        )
        b.debug = `id:  '${EPCIMatch?.code}'`
      })
      console.log(
        missingEPCI.map((b) => `${b.description} - ${b.debug}`).join("\n")
      )
    }

    expect(missingCommune.length).toEqual(0)
    expect(missingEPCI.length).toEqual(0)
  })
})
