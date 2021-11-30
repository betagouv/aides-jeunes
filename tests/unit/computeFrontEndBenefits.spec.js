const expect = require("expect")
const { buildOpenFiscaRequest } = require("@/../backend/lib/openfisca/mapping")
const {
  testProfileEligibility,
  testGeographicalEligibility,
  computeFrontEndBenefits,
} = require("../../lib/Benefits/ComputeFrontEnd")
import benefits from "@/../data/all"

describe("computeAides", function () {
  let commune
  let benefit
  let situation
  let studentSituation
  beforeEach(() => {
    commune = {
      code: "59313",
      departement: "59",
      region: "32",
    }
    benefit = {
      profils: [
        {
          type: "etudiant",
          conditions: [
            {
              type: "mention_baccalaureat",
              values: [
                "mention_tres_bien",
                "mention_tres_bien_felicitations_jury",
              ],
            },
          ],
        },
      ],
    }
    situation = {
      dateDeValeur: "2019-11-01",
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
    studentSituation = {
      dateDeValeur: "2019-11-01",
      demandeur: {
        id: "demandeur",
        date_naissance: "2000-01-01",
        activite: "etudiant",
        boursier: true,
        mention_baccalaureat: "mention_tres_bien",
      },
      famille: {},
      menage: {
        depcom: "64201",
      },
    }
  })

  it("test when no profile are required", function () {
    expect(testProfileEligibility({}, { situation: {} })).toBe(true)
  })

  it("test an situation with ineligible profile", function () {
    expect(testProfileEligibility(benefit, { situation })).toBe(false)
  })

  it("test an eligible situation", function () {
    const openfiscaRequest = buildOpenFiscaRequest(studentSituation)
    expect(
      testProfileEligibility(benefit, {
        situation: studentSituation,
        openfiscaResponse: openfiscaRequest,
      })
    ).toBe(true)
  })

  it("test situation that not respect conditions of profile", function () {
    studentSituation.demandeur.mention_baccalaureat = "mention_bien"
    const openfiscaRequest = buildOpenFiscaRequest(studentSituation)

    expect(
      testProfileEligibility(benefit, {
        situation: studentSituation,
        openfiscaResponse: openfiscaRequest,
      })
    ).toBe(false)
  })

  it("verify the result when commune is undefined", function () {
    expect(
      testGeographicalEligibility(
        {
          type: "departements",
          values: ["64", "45", "12"],
        },
        { commune: null }
      )
    ).toBe(false)
  })

  it("verify the result when no test are provided", function () {
    expect(testGeographicalEligibility({}, { commune: null })).toBe(true)
  })

  it("verify the result when a commune is not in benefit's department", function () {
    expect(
      testGeographicalEligibility(
        { type: "departements", values: ["45"] },
        { commune }
      )
    ).toBe(false)
  })

  it("verify the result when a commune is in benefit's region", function () {
    expect(
      testGeographicalEligibility(
        {
          type: "regions",
          values: ["32"],
        },
        { commune }
      )
    ).toBe(true)
  })

  it("adds the benefit amount when eligible", function () {
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(200)
  })

  it("adds 0 when ineligible profile", function () {
    situation.demandeur.activite = "salarie"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })

  it("adds 0 when ineligible city", function () {
    situation.menage.depcom = "95201"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })

  it("adds 0 when ineligible age", function () {
    situation.demandeur.date_naissance = "1988-01-01"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeFrontEndBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })

  it("verify an eligibile situation to benefit_front_test", function () {
    const openfiscaRequest = buildOpenFiscaRequest(studentSituation)
    computeFrontEndBenefits(benefits, studentSituation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(200)
  })

  it("verify an ineligible situation to benefit_front_test", function () {
    studentSituation.demandeur.boursier = false
    const openfiscaRequest = buildOpenFiscaRequest(studentSituation)
    computeFrontEndBenefits(benefits, studentSituation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })
})
