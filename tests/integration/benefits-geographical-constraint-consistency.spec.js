const expect = require("expect")
const {
  testGeographicalRelevancy,
} = require("../../tools/test-benefits-geographical-constraint-consistency")

describe("geographical constraint", function () {
  it("works for regional benefit", function () {
    const result = testGeographicalRelevancy({
      institution: { code_insee: "84", type: "region" },
      conditions_generales: [{ type: "regions", values: ["84"] }],
    })
    expect(result.isValid).toEqual(true)
  })

  it("works for departemental benefit", function () {
    const result = testGeographicalRelevancy({
      institution: { code_insee: "13", type: "departement" },
      conditions_generales: [{ type: "departements", values: ["13"] }],
    })
    expect(result.isValid).toEqual(true)
  })
})
