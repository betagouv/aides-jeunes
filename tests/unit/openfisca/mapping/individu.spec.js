const situation = {
  demandeur: { _bourseCriteresSociauxCommuneDomicileFamilial: "38185" },
  menage: { depcom: "33090" },
}

const subject = require("../../../../backend/lib/openfisca/mapping/individu")
const expect = require("expect")

describe("distance computation", function () {
  const result =
    subject.additionalProps.bourse_criteres_sociaux_distance_domicile_familial.fn(
      situation.demandeur,
      situation
    )

  it("should return a kilometer value", function () {
    expect(result).toBeCloseTo(510, -1.5) // -1.5 is in digits after the valid interval as a 10^1,5=30km size
  })
})
