import { generateSituation } from "@root/lib/situations"
import { buildOpenFiscaRequest } from "@root/backend/lib/openfisca/mapping"

const simulation = {
  answers: {
    all: [
      {
        id: "demandeur",
        entityName: "individu",
        fieldName: "date_naissance",
        value: "1999-12-31T23:00:00.000Z",
      },
      {
        id: "demandeur",
        entityName: "individu",
        fieldName: "ressources",
        value: ["pensions_alimentaires_percues"],
      },
      {
        id: "demandeur",
        entityName: "individu",
        fieldName: "pensions",
        value: [
          {
            id: "pensions_alimentaires_percues",
            amounts: {
              "2021-12": 100,
              "2021-11": 100,
              "2021-10": 100,
              "2021-09": 100,
              "2021-08": 100,
              "2021-07": 100,
              "2021-06": 100,
              "2021-05": 100,
              "2021-04": 100,
              "2021-03": 100,
              "2021-02": 100,
              "2021-01": 100,
              "2020-12": 100,
            },
          },
        ],
      },
    ],
    current: [
      {
        id: "demandeur",
        entityName: "individu",
        fieldName: "date_naissance",
        value: "1999-12-31T23:00:00.000Z",
      },
      {
        id: "demandeur",
        entityName: "individu",
        fieldName: "ressources",
        value: ["pensions_alimentaires_percues"],
      },
      {
        id: "demandeur",
        entityName: "individu",
        fieldName: "pensions",
        value: [
          {
            id: "pensions_alimentaires_percues",
            amounts: {
              "2021-12": 100,
              "2021-11": 100,
              "2021-10": 100,
              "2021-09": 100,
              "2021-08": 100,
              "2021-07": 100,
              "2021-06": 100,
              "2021-05": 100,
              "2021-04": 100,
              "2021-03": 100,
              "2021-02": 100,
              "2021-01": 100,
              "2020-12": 100,
            },
          },
        ],
      },
    ],
  },
  dateDeValeur: "2021-12-09T16:57:54.234Z",
  version: 3,
  ressourcesFiscales: {
    demandeur: {
      salaire_imposable: undefined,
      chomage_imposable: undefined,
      retraite_imposable: 1200,
      frais_reels: undefined,
      pensions_alimentaires_percues: 2400,
      pensions_alimentaires_versees: undefined,
      revenus_locatifs: undefined,
    },
  },
}
describe("The situation", function () {
  it('should contain a value for `pensions_alimentaires_percues` during last 12 month and and during the fiscal year"', function () {
    const situation = generateSituation(simulation, true)

    expect(situation.demandeur.pensions_alimentaires_percues["2019"]).toEqual(
      2400
    )
    expect(
      situation.demandeur.pensions_alimentaires_percues["2021-12"]
    ).toEqual(100)
  })

  it("should create an openfisca request with valid ressources`", function () {
    const situation = generateSituation(simulation, true)
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    expect(
      openfiscaRequest.individus.demandeur.pensions_alimentaires_percues[
        "2019-01"
      ]
    ).toEqual(200)
    expect(
      openfiscaRequest.individus.demandeur.pensions_alimentaires_percues[
        "2021-12"
      ]
    ).toEqual(100)
    expect(
      openfiscaRequest.individus.demandeur.retraite_imposable["2019-12"]
    ).toEqual(100)
  })
})
