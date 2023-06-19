import { computeAidesVeloBenefits } from "@root/lib/benefits/compute-aides-velo"

describe("computeAidesVeloBenefits", function () {
  it("matches EPCI data", function () {
    const benefits = [{ external_id: "aides . vallée d'ossau" }]
    const situation = {
      dateDeValeur: "2021-01-01",
      menage: {
        _codePostal: "64260",
        depcom: "64062",
        _departement: "64",
        _epci: "246400337",
        _region: "75",
      },
      demandeur: {
        _interetsAidesVelo: ["velo_electrique"],
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
