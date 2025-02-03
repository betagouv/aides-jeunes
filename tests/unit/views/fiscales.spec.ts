import { expect } from "@jest/globals"
import FiscalesView from "@/views/simulation/Ressources/fiscales.vue"

describe("fiscales.vue", () => {
  it("compute fiscale sum per category and period", () => {
    const testSet = [
      {
        months: [
          { id: "2022-09", label: "septembre 2022" },
          { id: "2022-08", label: "août 2022" },
          { id: "2022-07", label: "juillet 2022" },
        ],
        individu: {
          revenus_locatifs: {
            "2022-10": 90,
            "2022-09": 80,
            "2022-08": 70,
          },
        },
        rnc: { sources: ["revenus_locatifs"] },
        result: 150,
      },
      {
        months: [
          { id: "2022-09", label: "septembre 2022" },
          { id: "2022-08", label: "août 2022" },
          { id: "2022-07", label: "juillet 2022" },
        ],
        individu: {
          revenus_locatifs: {
            "2021-10": 90,
            "2021-09": 80,
          },
        },
        rnc: { sources: ["revenus_locatifs"] },
        result: 0,
      },
    ]
    for (const test of testSet) {
      expect(
        FiscalesView.methods.getDefaultValue(
          test.months,
          test.individu,
          test.rnc
        )
      ).toEqual(test.result)
    }
  })
})
