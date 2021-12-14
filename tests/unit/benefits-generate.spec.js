const expect = require("expect")

describe("benefit descriptions", function () {
  const subject = require("../../data").fn

  it("exists", function () {
    const collections = {
      institutions: {
        items: [
          { slug: "etat", national: true },
          { slug: "region", id: "region_id" },
        ],
      },
      benefits_javascript: {
        items: [
          { slug: "etat_benefit2", institution: "etat", source: "javascript" },
        ],
      },
      benefits_openfisca: {
        items: [{ slug: "region_benefit", institution: "region" }],
      },
    }

    const customBenefits = [{ id: "etat_benefit", institution: "etat" }]

    const result = subject(collections, customBenefits, [])
    expect(
      result.institutionsMap.etat.benefitsIds.includes("etat_benefit")
    ).toBeTruthy()
    expect(result.benefitsMap.etat_benefit.institution.id).toBe("etat")
    expect(
      result.institutionsMap.etat.benefitsIds.includes("etat_benefit2")
    ).toBeTruthy()
    expect(result.benefitsMap.etat_benefit2.institution.id).toBe("etat")
    expect(
      result.institutionsMap.region.benefitsIds.includes("region_benefit")
    ).toBeTruthy()
    expect(result.benefitsMap.region_benefit.institution.id).toBe("region_id")
    expect(result.all.length).toBe(3)
  })
})
