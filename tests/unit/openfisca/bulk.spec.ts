import { expect } from "@jest/globals"
import bulk from "@root/backend/lib/openfisca/bulk/index.js"
const { build, extractResults } = bulk

const situation: any = {
  dateDeValeur: "2021-01",
  demandeur: { id: "demandeur" },
  famille: {},
  menage: {},
}

describe("openfisca build generation", function () {
  it("generates a non empty string", function () {
    const result: any = build(situation, "ressource")

    const collection = result.individus["1000_demandeur"].ressource
    const value = collection[Object.keys(collection)[0]]
    expect(value).toBe(1000 * (4 * 12))
  })
})

describe("openfisca result extraction", function () {
  it("generates a non empty string", function () {
    const result = extractResults(
      {
        source: {
          dateDeValeur: "2021-01",
        },
        response: {
          individus: {
            "1000_id": {},
          },
          familles: {},
          menages: {},
          foyers_fiscaux: {
            "1000_": {
              irpp: {
                2021: 120,
              },
            },
          },
        },
      },
      ["irpp"]
    )
    expect(result["1000"].irpp).toBe(10)
  })
})
