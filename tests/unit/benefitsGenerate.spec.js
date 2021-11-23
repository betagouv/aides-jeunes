const expect = require("expect")

describe("benefit descriptions", function () {
  const subject = require("../../data").fn

  it("exists", function () {
    const collections = {
      institutions: {
        items: [{ slug: "etat", national: true }, { slug: "region" }],
      },
      benefits_javascript: {
        items: [
          { slug: "etat_benefit2", institution: "etat", computesLocally: true },
        ],
      },
      benefits_openfisca: {
        items: [{ slug: "region_benefit", institution: "region" }],
      },
    }

    const customBenefits = [{ slug: "etat_benefit", institution: "etat" }]

    const result = subject(collections, customBenefits)
    expect(result.groupByInstitution.etat.prestations.etat_benefit).toBeTruthy()
    expect(
      result.groupByInstitution.etat.prestations.etat_benefit2
    ).toBeTruthy()
    expect(
      result.groupByInstitution.region.prestations.region_benefit
    ).toBeTruthy()
    expect(result.all.length).toBe(3)
  })
})
