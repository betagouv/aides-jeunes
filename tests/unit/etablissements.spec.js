import { normalize } from "@root/lib/benefits/etablissements"

describe("isEqual function", () => {
  const testSet = [
    {
      etablissement: {
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
  for (let test of testSet) {
    it("compares simple values", () => {
      expect(normalize(test.etablissement)).toEqual(test.result)
    })
  }
})
