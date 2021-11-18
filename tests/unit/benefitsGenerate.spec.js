const expect = require("expect")

describe("benefit descriptions", function () {
  const subject = require("../../data/js/benefits/utils").generate

  it("exists", function () {
    const collections = {
      institutions: {
        items: [{ slug: "etat", national: true }, { slug: "region" }],
      },
      benefits: {
        items: [
          { slug: "etat_benefit2", institution: "etat" },
          { slug: "region_benefit", institution: "region" },
        ],
      },
    }

    const customBenefits = [{ slug: "etat_benefit", institution: "etat" }]

    const result = subject(collections, customBenefits)
    expect(
      result.prestationsNationales.etat.prestations.etat_benefit
    ).toBeTruthy()
    expect(
      result.prestationsNationales.etat.prestations.etat_benefit2
    ).toBeTruthy()
    expect(
      result.partenairesLocaux.region.prestations.region_benefit
    ).toBeTruthy()
  })
})
