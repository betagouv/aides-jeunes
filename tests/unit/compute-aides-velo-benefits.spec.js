const expect = require("expect")
const {
  computeAidesVeloBenefits,
} = require("../../lib/Benefits/compute-aides-velo")

describe("computeAidesVeloBenefits", function () {
  it("matches EPCI data", function () {
    const benefits = [
      { i: "intercommunalite_pays_issoire", titre: "Agglo Pays D'Issoire" },
    ]
    const situation = {
      menage: {
        _codePostal: "63500",
        depcom: "63178",
        _departement: "63",
        _epci: "200070407",
        _region: "84",
      },
    }
    const results = []
    computeAidesVeloBenefits(benefits, results, situation)

    expect(results.length).toBe(1)
  })

  it("interpolates placeholders in benefit descriptions", function () {
    const benefits = [{ i: "paris", titre: "Ville de Paris" }]
    const situation = {
      menage: {
        _codePostal: "75001",
        depcom: "75056",
        _departement: "75",
        _epci: "200054781",
        _region: "11",
      },
    }
    const results = []
    computeAidesVeloBenefits(benefits, results, situation)
    expect(results[0].description).toEqual(
      expect.not.stringContaining("$plafond")
    )
  })
})
