var expect = require("expect")

describe("benefit descriptions", function () {
  var subject = require("../../data/js/benefits/utils").generate

  it("exists", function () {
    const collections = {
      institutions: { items: [] },
      benefits: { items: [{ slug: "id", institution: "etat" }] },
    }

    const base = {
      prestationsNationales: { etat: { prestations: {} } },
      partenairesLocaux: {},
    }

    subject(collections, base)
    expect(base.prestationsNationales.etat.prestations.id).toBeTruthy()
  })
})
