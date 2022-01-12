const expect = require("expect")
const {
  computeAidesVeloBenefits,
} = require("../../lib/benefits/compute-aides-velo")

describe("computeAidesVeloBenefits", function () {
  it("matches EPCI data", function () {
    const benefits = [{ external_id: "aides . pays basque" }]
    const situation = {
      dateDeValeur: "2021-01-01",
      menage: {
        _codePostal: "64100",
        depcom: "64102",
        _departement: "64",
        _epci: "200067106",
        _region: "75",
      },
    }
    const openFiscaResponse = {
      foyers_fiscaux: {
        _: {
          rfr: {
            2019: 42,
          },
        },
      },
    }
    const results = []
    computeAidesVeloBenefits(benefits, results, situation, openFiscaResponse)

    expect(results.length).toBe(1)
  })
})
