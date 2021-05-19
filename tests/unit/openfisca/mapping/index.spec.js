var situation = {
  dateDeValeur: new Date("2017-10-02"),
  demandeur: {},
  famille: {},
  foyer_fiscal: {},
  menage: {
    personne_de_reference: ["id"],
    statut_occupation_logement: "sans_domicile",
  },
}

var subject = require("../../../../backend/lib/openfisca/mapping")
var expect = require("expect")

describe("openfisca buildOpenFiscaRequest", function () {
  var result = subject.buildOpenFiscaRequest(situation)

  it("writes null for css_participation_forfaitaire in 2017-10", function () {
    expect(result.familles._.css_participation_forfaitaire["2017-10"]).toBe(
      null
    )
  })
})
