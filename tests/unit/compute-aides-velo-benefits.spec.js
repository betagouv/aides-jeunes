const expect = require("expect")
const {
  computeAidesVeloBenefits,
} = require("../../lib/Benefits/compute-aides-velo")

describe("computeAidesVeloBenefits", function () {
  it("matches EPCI data", function () {
    const benefits = [{ id: "aides . pays basque" }]
    const situation = {
      menage: {
        _codePostal: "64100",
        depcom: "64102",
        _departement: "64",
        _epci: "200067106",
        _region: "75",
      },
    }
    const results = []
    computeAidesVeloBenefits(benefits, results, situation)

    expect(results.length).toBe(1)
  })
})
