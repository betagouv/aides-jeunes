import { expect } from "@jest/globals"
import { buildOpenFiscaRequest } from "@root/backend/lib/openfisca/mapping/index.js"
import {
  testProfileEligibility,
  testGeographicalEligibility,
  computeJavascriptBenefits,
} from "@root/lib/benefits/compute-javascript.js"
import benefits from "@root/data/all.js"
import { Scolarite, MentionBaccalaureat } from "@lib/enums/scolarite.js"

describe("computeAides", function () {
  let benefit
  let situation
  let studentSituation
  beforeEach(() => {
    benefit = {
      profils: [
        {
          type: Scolarite.EnseignementSuperieur,
          conditions: [
            {
              type: "mention_baccalaureat",
              values: [
                MentionBaccalaureat.MentionTresBien,
                MentionBaccalaureat.MentionTresBienFelicitationsJury,
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
        scolarite: Scolarite.EnseignementSuperieur,
        mention_baccalaureat: MentionBaccalaureat.MentionTresBien,
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
    studentSituation.demandeur.mention_baccalaureat =
      MentionBaccalaureat.MentionBien
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

describe("Test condition taux_incapacite", function () {
  let situation_handicap
  let benefit_situation_handicap

  beforeEach(() => {
    situation_handicap = {
      demandeur: {
        activite: "situation_handicap",
        taux_incapacite: 0.3,
      },
    }
    benefit_situation_handicap = {
      profils: [
        {
          type: "situation_handicap",
          conditions: [
            {
              type: "taux_incapacite",
              value: 0.5,
              operator: ">=",
            },
          ],
        },
      ],
    }
  })

  it("Checks that someone with incapacite 30 is not eligible with 50+", function () {
    expect(
      testProfileEligibility(benefit_situation_handicap, {
        situation: situation_handicap,
      })
    ).toBe(false)
  })

  it("Checks that someone with incapacite 50 is eligible with >= 50", function () {
    situation_handicap.demandeur.taux_incapacite = 0.5

    expect(
      testProfileEligibility(benefit_situation_handicap, {
        situation: situation_handicap,
      })
    ).toBe(false)
  })

  it("Checks that someone with incapacite 50 is not eligible with > 50", function () {
    situation_handicap.demandeur.taux_incapacite = 0.5
    benefit_situation_handicap.profils[0].conditions[0].operator = ">"

    expect(
      testProfileEligibility(benefit_situation_handicap, {
        situation: situation_handicap,
      })
    ).toBe(false)
  })

  it("Checks that someone with incapacite 81 is not eligible with > 50 AND < 80", function () {
    situation_handicap.demandeur.taux_incapacite = 0.81
    benefit_situation_handicap.profils[0].conditions = [
      {
        type: "taux_incapacite",
        value: 0.5,
        operator: ">",
      },
      {
        type: "taux_incapacite",
        value: 0.8,
        operator: "<",
      },
    ]
    expect(
      testProfileEligibility(benefit_situation_handicap, {
        situation: situation_handicap,
      })
    ).toBe(false)
  })
})
