import { expect } from "@jest/globals"
import Commune from "@/lib/commune.js"
import { CommuneInterface } from "@lib/types/commune.js"

describe("commune.js", () => {
  it("sort Communes following population criteria", () => {
    const communes = [
      { nom: "Ailhon", population: 551 },
      { nom: "Aubenas", population: 12479 },
      { nom: "Fons", population: 333 },
    ] as unknown as CommuneInterface[]
    const result = { nom: "Aubenas", population: 12479 }
    expect(Commune.getMostPopulated(communes)).toEqual(result)
  })
  it("return first value if no population is specified", () => {
    const communes = [
      { nom: "Ailhon" },
      { nom: "Aubenas" },
      { nom: "Fons" },
    ] as unknown as CommuneInterface[]
    const result = { nom: "Ailhon" }
    expect(Commune.getMostPopulated(communes)).toEqual(result)
  })
  it("return no values if there is no commune specified", () => {
    expect(Commune.getMostPopulated([])).toEqual({})
  })
})
