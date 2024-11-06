import { StandardBenefit } from "@data/types/benefits.js"
import { expect } from "@jest/globals"
import { Velo } from "@lib/enums/velo.js"
import { Situation } from "@lib/types/situations.js"
import { computeAidesVeloBenefits } from "@root/lib/benefits/compute-aides-velo.js"

describe("computeAidesVeloBenefits", function () {
  it("matches EPCI data", function () {
    const benefits = [{ external_id: "aides . vallée d'ossau" }]
    const situation: Situation = {
      dateDeValeur: 1609459200000, // 2021-01-01
      menage: {
        _codePostal: "64260",
        depcom: "64062",
        _departement: "64",
        _epci: "246400337",
        _region: "75",
      },
      demandeur: {
        _interetsAidesVelo: [Velo.VeloElectrique],
        date_naissance: "1990-01-01",
        id: "",
        enfant_a_charge: undefined,
        nationalite: undefined,
        _role: "",
      },
      enfants: [],
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
    computeAidesVeloBenefits(
      benefits as StandardBenefit[],
      results,
      situation,
      openFiscaResponse
    )

    expect(results.length).toBe(1)
  })
})
