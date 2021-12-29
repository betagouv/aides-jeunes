const expect = require("expect")
const {
  computeAidesVeloBenefits,
} = require("../../lib/Benefits/compute-aides-velo")

describe("computeAidesVeloBenefits", function () {
  it("EPCI matching", function () {
    const results = []
    computeAidesVeloBenefits(results, {
      menage: {
        _codePostal: "63500",
        depcom: "63178",
        _departement: "63",
        _epci: "200070407",
        _region: "84",
      },
    })

    expect(results.length).toBe(2)
  })
})
