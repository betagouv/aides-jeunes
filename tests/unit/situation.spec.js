import { generateSituation } from "../../lib/situations"
import { buildOpenFiscaRequest } from "../../backend/lib/openfisca/mapping"

const answers = {
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
  dateDeValeur: "2021-12-09T16:57:54.234Z",
  version: 3,
  ressourcesFiscales: {
    demandeur: {
      salaire_imposable: undefined,
      chomage_imposable: undefined,
      retraite_imposable: undefined,
      frais_reels: undefined,
      pensions_alimentaires_percues: 2400,
      pensions_alimentaires_versees: undefined,
      revenus_locatifs: undefined,
    },
  },
}
describe("The situation", function () {
  xit('should contain a value for `pensions_alimentaires_percues` during last 12 month and and during the fiscal year"', function () {
    const situation = generateSituation(answers, true)

    expect(situation.demandeur.pensions_alimentaires_percues["2019"]).toEqual(
      2400
    )
    expect(
      situation.demandeur.pensions_alimentaires_percues["2021-12"]
    ).toEqual(100)
  })

  it("should create an openfisca request with `valid pensions_alimentaires_percues`", function () {
    const situation = generateSituation(answers, true)
    const openfiscaRequest = buildOpenFiscaRequest(situation)
    console.log(
      openfiscaRequest.individus.demandeur.pensions_alimentaires_percues
    )
    expect(
      openfiscaRequest.individus.demandeur.pensions_alimentaires_percues["2019"]
    ).toEqual(2400)
    expect(
      openfiscaRequest.individus.demandeur.pensions_alimentaires_percues[
        "2021-12"
      ]
    ).toEqual(100)
    expect(
      openfiscaRequest.individus.demandeur.pensions_alimentaires_percues.length
    ).toEqual(13)
  })
})
