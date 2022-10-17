import Types from "@/components/ressource/types.vue"

describe("types.vue", () => {
  it("sort ressource types following multiple criterias", () => {
    const categories = [
      { label: "Stage" },
      { positionInList: 1, label: "Salaire 1" },
      { positionInList: 2, label: "Salaire 2" },
      { label: "Prime" },
    ]
    const result = [
      { positionInList: 1, label: "Salaire 1" },
      { positionInList: 2, label: "Salaire 2" },
      { label: "Prime" },
      { label: "Stage" },
    ]
    expect(Types.methods.sort(categories)).toEqual(result)
  })

  it("group ressource types", () => {
    const categories = [
      { label: "Salaire", category: "Revenus" },
      { label: "Revenus de stage", category: "Revenus" },
      { label: "APL", category: "Allocations" },
      { label: "Bourse", category: "Autre" },
    ]
    const result = [
      { positionInList: 1, label: "Salaire 1" },
      { positionInList: 2, label: "Salaire 2" },
      { label: "Prime" },
      { label: "Stage" },
    ]
    expect(Types.methods.sort(categories)).toEqual(result)
  })
})
