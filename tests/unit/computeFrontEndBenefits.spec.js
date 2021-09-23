const expect = require("expect")
const { buildOpenFiscaRequest } = require("@/../backend/lib/openfisca/mapping")
const {
  computeFrontEndBenefits,
} = require("@/../backend/lib/mes-aides/computeFrontEndBenefits")
import droitsDescription from "@/../app/js/constants/benefits/back"

describe("computeAides", function () {
  let situation
  beforeEach(() => {
    situation = {
      dateDeValeur: "2014-11-01",
      demandeur: {
        id: "demandeur",
        date_naissance: "2000-01-01",
        activite: "chomeur",
      },
      famille: {},
      menage: {
        depcom: "64201",
      },
    }
  })
  it("adds the benefit amount when eligible", function () {
    var openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(200)
  })

  it("adds 0 when ineligible statut", function () {
    situation.demandeur.activite = "actif"
    var openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(0)
  })
  it("adds 0 when ineligible city", function () {
    situation.menage.depcom = "95201"
    var openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(0)
  })
  it("adds 0 when ineligible age", function () {
    situation.demandeur.date_naissance = "1988-01-01"
    var openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(0)
  })
})
