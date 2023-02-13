import expect from "expect"
import subject from "@root/data"

describe("benefit descriptions", function () {
  it("exists", function () {
    const collections = {
      institutions: {
        items: [
          { slug: "etat", type: "national" },
          {
            slug: "region_nouvelle_aquitaine",
            code_insee: "75",
            type: "region",
          },
        ],
      },
      institution_types: {
        items: [
          { slug: "national", name: "Organisation nationale" },
          { slug: "region", name: "Région" },
        ],
      },
      benefits_javascript: {
        items: [
          { slug: "etat_benefit2", institution: "etat", source: "javascript" },
        ],
      },
      benefits_openfisca: {
        items: [
          { slug: "etat_benefit", institution: "etat" },
          { slug: "region_benefit", institution: "region_nouvelle_aquitaine" },
        ],
      },
    }

    const additionalBenefitAttributes = { etat_benefit: { test: () => {} } }
    const result = subject.fn(collections, additionalBenefitAttributes)

    expect(
      result.institutionsMap.etat.benefitsIds.includes("etat_benefit")
    ).toBeTruthy()
    expect(typeof result.benefitsMap.etat_benefit.test).toBe("function")
    expect(result.benefitsMap.etat_benefit.institution.id).toBe("national_etat")
    expect(
      result.institutionsMap.etat.benefitsIds.includes("etat_benefit2")
    ).toBeTruthy()
    expect(result.benefitsMap.etat_benefit2.institution.id).toBe(
      "national_etat"
    )
    expect(
      result.institutionsMap.region_nouvelle_aquitaine.benefitsIds.includes(
        "region_benefit"
      )
    ).toBeTruthy()
    expect(result.benefitsMap.region_benefit.institution.id).toBe("region_75")
    expect(result.all.length).toBe(3)
  })
})
