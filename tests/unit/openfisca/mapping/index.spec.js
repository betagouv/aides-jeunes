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

  it("not overrides resources with 3 month replication", function () {
    var result = subject.buildOpenFiscaRequest(
      Object.assign({}, situation, {
        demandeur: {
          id: "demandeur",
          bourse_lycee: {
            "2017-10": 42,
            "2016-10": 3,
          },
        },
        famille: {
          bourse_lycee: true,
        },
      })
    )
    console.log(result.familles._.bourse_lycee)
    expect(result.familles._.bourse_lycee["2017-10"]).toBe(42)
  })

  it("allows resource overrides with 3 month replication", function () {
    var result = subject.buildOpenFiscaRequest(
      Object.assign({}, situation, {
        famille: {
          bourse_lycee: true,
        },
      })
    )
    console.log(result.familles._.bourse_lycee)
    expect(result.familles._.bourse_lycee["2017-09"]).toBe(true)
  })

  it("send bourse_lycee of demandeur", function () {
    var result = subject.buildOpenFiscaRequest(
      Object.assign({}, situation, {
        demandeur: {
          id: "demandeur",
          bourse_lycee: {
            "2017-10": 42,
            "2016-10": 3,
          },
        },
      })
    )
    console.log(result.familles._.bourse_lycee)
    expect(result.familles._.bourse_lycee["2017-10"]).toBe(42)
  })
})
