var expect = require("expect")
var { buildOpenFiscaRequest } = require("@/../backend/lib/openfisca/mapping")
var { computeFrontEndBenefits } = require("@/../backend/lib/mes-aides/computeFrontEndBenefits")
import droitsDescription from "@/../app/js/constants/benefits/back"


describe("computeAides", function () {
  it("adds the benefit amount when eligible", function () {
    var situation = {
      dateDeValeur: "2014-11-01",
      demandeur: {
        id: 'demandeur',
        date_naissance: '2000-01-01',
        activite: 'chomeur',
      },
      famille: {},
      menage: {
        depcom: '64201',
      },
    }
    var openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(openfiscaRequest.individus.demandeur.a['2014-11']).toBe(200)
  })

  it("adds 0 when ineligible", function () {
    var situation = {
      dateDeValeur: "2014-11-01",
      demandeur: {
        id: 'demandeur',
        date_naissance: '2000-01-01',
        activite: 'actif',
      },
      famille: {},
      menage: {
        depcom: '64201',
      },
    }
    var openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(openfiscaRequest.individus.demandeur.a['2014-11']).toBe(0)
  })

})
