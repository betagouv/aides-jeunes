const expect = require("expect")

const { getAjInstitution } = require("../../tools/generate-matches-worksheet")

describe("logic for departemental PE benefit", function () {
  it("gets a relevant AJ institution", function () {
    const result = getAjInstitution({
      districts: ["46 - Lot"],
      geographicalArea: "Échelle départementale",
    })
    expect(result.slug).toBe("departement_lot")
  })

  it("gets an irrelevant AJ institution", function () {
    const result = getAjInstitution({
      districts: ["66 - Pyrénées-Orientales"],
      geographicalArea: "Échelle départementale",
    })
    expect(result.slug).not.toBe("departement_lot")
  })
})

describe("logic for regional PE benefit", function () {
  it("gets a relevant AJ institution", function () {
    const result = getAjInstitution({
      geographicalArea: "Échelle régionale",
      organism: { slug: "region-hauts-de-france" },
      regions: ["Hauts-de-France"],
    })
    expect(result.slug).toBe("hauts_de_france")
  })

  it("gets an irrelevant AJ institution", function () {
    const result = getAjInstitution({
      organism: { slug: "region-corse" },
      geographicalArea: "Échelle régionale",
      regions: ["Corse"],
    })
    expect(result.slug).not.toBe("hauts_de_france")
  })
})

describe("logic for communal PE benefit", function () {
  it("gets a relevant AJ institution", function () {
    const result = getAjInstitution({
      cities: ["Béthune (62400)"],
      geographicalArea: "Échelle communale",
    })
    expect(result.slug).toBe("ville_bethune")
  })

  it("gets an irrelevant AJ institution", function () {
    const result = getAjInstitution({
      cities: ["Comines (59560)"],
      geographicalArea: "Échelle communale",
    })
    expect(result.slug).not.toBe("ville_bethune")
  })
})
