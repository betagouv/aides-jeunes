const expect = require("expect")
const { buildOpenFiscaRequest } = require("@/../backend/lib/openfisca/mapping")
const {
  testEligibiliteGeographique,
  computeFrontEndBenefits,
} = require("../../lib/ComputeFrontEndBenefits")
import droitsDescription from "@/../data/js/benefits/back"

describe("computeAides", function () {
  let commune
  let situation
  beforeEach(() => {
    commune = {
      code: "59313",
      departement: "59",
      region: "32",
    }
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

  it("verify the result when commune is undefined", function () {
    expect(
      testEligibiliteGeographique(null, {
        departements: ["64", "45", "12"],
      })
    ).toBe(false)
  })

  it("verify the result when no test are provided", function () {
    expect(testEligibiliteGeographique(null, {})).toBe(true)
  })

  it("verify the result when a commune is not in benefit's department", function () {
    expect(testEligibiliteGeographique(commune, { departements: ["45"] })).toBe(
      false
    )
  })

  it("verify the result when a commune is in benefit's region", function () {
    expect(
      testEligibiliteGeographique(commune, {
        departements: ["45"],
        regions: ["32"],
      })
    ).toBe(true)
  })

  it("adds the benefit amount when eligible", function () {
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(200)
  })

  it("adds 0 when ineligible statut", function () {
    situation.demandeur.activite = "salarie"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(0)
  })
  it("adds 0 when ineligible city", function () {
    situation.menage.depcom = "95201"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(0)
  })
  it("adds 0 when ineligible age", function () {
    situation.demandeur.date_naissance = "1988-01-01"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(droitsDescription, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test["2014-11"]
    ).toBe(0)
  })
})
