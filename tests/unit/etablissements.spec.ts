import { expect } from "@jest/globals"
import { normalize } from "@root/lib/benefits/lieux.js"

describe("isEqual function", () => {
  const testSet = [
    {
      lieu: {
        properties: {
          adresses: [
            {
              type: "Adresse postale",
              codePostal: "75656",
            },
            {
              type: "géopostale",
              codePostal: "75018",
            },
          ],
          horaires: [
            {
              du: "Jeudi",
              au: "Vendredi",
            },
            {
              du: "Lundi",
              au: "Mercredi",
            },
          ],
          url: "https://www.maisondeservicesaupublic.fr",
        },
      },
      result: {
        adresse: {
          type: "géopostale",
          codePostal: "75018",
        },
        adresses: [
          {
            type: "Adresse postale",
            codePostal: "75656",
          },
          {
            type: "géopostale",
            codePostal: "75018",
          },
        ],
        horaires: [
          {
            du: "Lundi",
            au: "Mercredi",
          },
          {
            du: "Jeudi",
            au: "Vendredi",
          },
        ],
      },
    },
  ]
  for (const test of testSet) {
    it("compares simple values", () => {
      expect(normalize(test.lieu)).toEqual(test.result)
    })
  }
})
