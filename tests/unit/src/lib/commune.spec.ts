import { expect } from "@jest/globals"
import CommuneMethods from "@/lib/commune.js"
import { Commune } from "@lib/types/commune.js"

describe("commune.js", () => {
  it("sort Communes following population criteria", () => {
    const communes = [
      { nom: "Ailhon", population: 551 },
      { nom: "Aubenas", population: 12479 },
      { nom: "Fons", population: 333 },
    ] as unknown as Commune[]
    const result = { nom: "Aubenas", population: 12479 }
    expect(CommuneMethods.getMostPopulated(communes)).toEqual(result)
  })
  it("return first value if no population is specified", () => {
    const communes = [
      { nom: "Ailhon" },
      { nom: "Aubenas" },
      { nom: "Fons" },
    ] as unknown as Commune[]
    const result = { nom: "Ailhon" }
    expect(CommuneMethods.getMostPopulated(communes)).toEqual(result)
  })
  it("return no values if there is no commune specified", () => {
    expect(CommuneMethods.getMostPopulated([])).toEqual({})
  })
})
