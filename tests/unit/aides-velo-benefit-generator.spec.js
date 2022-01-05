const expect = require("expect")
const benefits = require("../../data/all")

const generator = require("../../data/benefits/aides-velo-generator.js")

describe("aides velo benefit generator", function () {
  it("maps all benefits to existing institutions", function () {
    const list = generator(Object.values(benefits))
    const missingInstitutionBenefits = list.filter((b) => !b.institution)

    expect(missingInstitutionBenefits).toEqual([])
  })
})
