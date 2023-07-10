import { expect } from "@jest/globals"
import { buildOpenFiscaRequest } from "@root/backend/lib/openfisca/mapping/index.js"
import {
  testProfileEligibility,
  testGeographicalEligibility,
  computeJavascriptBenefits,
} from "@root/lib/benefits/compute-javascript.js"
import benefits from "@root/data/all.js"

describe("computeAides", function () {
  let benefit
  let situation
  let studentSituation
  beforeEach(() => {
    benefit = {
      profils: [
        {
          type: "enseignement_superieur",
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
        _departement: "64",
        _epci: "244900015",
        _region: "75",
      },
    }
    studentSituation = {
      dateDeValeur: "2019-11-01",
      demandeur: {
        id: "demandeur",
        date_naissance: "2000-01-01",
        activite: "etudiant",
        boursier: true,
        scolarite: "enseignement_superieur",
        mention_baccalaureat: "mention_tres_bien",
      },
      famille: {},
      menage: {
        depcom: "64201",
        _departement: "64",
        _region: "75",
      },
    }
  })

  it("test when no profile are required", function () {
    expect(testProfileEligibility({}, { situation: {} })).toBe(true)
  })

  it("test when profils are empty ", function () {
    expect(
      testProfileEligibility(
        {
          profils: [],
        },
        { situation: {} }
      )
    ).toBe(true)
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

  const situationMissingCommune = {
    dateDeValeur: Date.now(),
    demandeur: {
      id: "demandeur",
      date_naissance: "2000-01-01",
      activite: "salarie",
      enfant_a_charge: undefined,
      nationalite: undefined,
      _role: "",
    },
    enfants: [],
    menage: {},
  }
  it("verify the result when commune is undefined", function () {
    expect(
      testGeographicalEligibility(
        {
          type: "departements",
          values: ["64", "45", "12"],
        },
        { situation: situationMissingCommune }
      )
    ).toBe(false)
  })

  it("verify the result when no test are provided", function () {
    expect(
      testGeographicalEligibility({}, { situation: situationMissingCommune })
    ).toBe(true)
  })

  it("verify the result when a commune is not in benefit's department", function () {
    expect(
      testGeographicalEligibility(
        { type: "departements", values: ["59"] },
        { situation }
      )
    ).toBe(false)
  })

  it("verify the result when a commune is in benefit's region", function () {
    expect(
      testGeographicalEligibility(
        {
          type: "regions",
          values: ["75"],
        },
        { situation }
      )
    ).toBe(true)
  })

  it("verify the result when a commune is in benefit's EPCI", function () {
    expect(
      testGeographicalEligibility(
        {
          type: "epcis",
          values: ["244900015"],
        },
        { situation }
      )
    ).toBe(true)
  })

  it("adds the benefit amount when eligible", function () {
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeJavascriptBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(200)
  })

  it("adds 0 when ineligible profile", function () {
    situation.demandeur.activite = "salarie"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeJavascriptBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })

  it("adds 0 when ineligible city", function () {
    situation.menage.depcom = "95201"
    situation.menage._departement = "95"
    situation.menage._region = "11"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeJavascriptBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })

  it("adds 0 when ineligible age", function () {
    situation.demandeur.date_naissance = "1988-01-01"
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    computeJavascriptBenefits(benefits, situation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })

  it("verify an eligibile situation to benefit_front_test", function () {
    const openfiscaRequest = buildOpenFiscaRequest(studentSituation)
    computeJavascriptBenefits(benefits, studentSituation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(200)
  })

  it("verify an ineligible situation to benefit_front_test", function () {
    studentSituation.demandeur.boursier = false
    const openfiscaRequest = buildOpenFiscaRequest(studentSituation)
    computeJavascriptBenefits(benefits, studentSituation, openfiscaRequest)
    expect(
      openfiscaRequest.individus.demandeur.benefit_front_test[
        situation.dateDeValeur.slice(0, 7)
      ]
    ).toBe(0)
  })
})
