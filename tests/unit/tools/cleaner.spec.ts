import { expect } from "vitest"
import {
  anonymizeSimulation,
  anonymizeFollowup,
} from "@root/lib/cleaner-functions.js"
import { SimulationStatus } from "@root/lib/enums/simulation.js"
import { LogementCategory } from "@lib/enums/logement.js"
import { Activite } from "@lib/enums/activite.js"

const anId = "123"

describe("anonymizeFollowup", () => {
  it("should anonymize followup", () => {
    const followup = {
      id: anId,
      email: "test@test.com",
      error: "an error that could contain personal data",
    }

    const anonymizedFollowup = anonymizeFollowup(followup)

    expect(anonymizedFollowup.id).toEqual(anId)
    expect(anonymizedFollowup.email).toEqual(undefined)
    expect(anonymizedFollowup.error).toEqual(undefined)
  })
})

describe("anonymizeSimulation", () => {
  it("should anonymize simulation", () => {
    const simulation = {
      id: anId,
      status: SimulationStatus.New,
      dateDeValeur: "2023-04-20T13:36:57.634Z",
      answers: {
        all: [
          {
            entityName: "individu",
            fieldName: "date_naissance",
            id: "demandeur",
            value: "1994-03-30T00:00:00.000Z",
          },
          {
            entityName: "individu",
            fieldName: "nationalite",
            id: "demandeur",
            value: "FR",
          },
          {
            entityName: "individu",
            fieldName: "activite",
            id: "demandeur",
            value: Activite.Independant,
          },
          {
            entityName: "individu",
            fieldName: "handicap",
            id: "demandeur",
            value: false,
          },
          {
            entityName: "individu",
            fieldName: "enceinte",
            id: "demandeur",
            value: "pas_enceinte",
          },
          {
            entityName: "enfants",
            value: 0,
          },
          {
            entityName: "famille",
            fieldName: "en_couple",
            value: false,
          },
          {
            entityName: "menage",
            fieldName: "_logementType",
            value: LogementCategory.Proprietaire,
          },
          {
            entityName: "menage",
            fieldName: "_primoAccedant",
            value: false,
          },
          {
            entityName: "menage",
            fieldName: "loyer",
            value: {
              loyer: 120,
            },
          },
          {
            entityName: "menage",
            fieldName: "depcom",
            value: {
              depcom: "75056",
              _codePostal: "75011",
              _nomCommune: "Paris",
              _departement: "75",
              _region: "11",
              _epci: "200054781",
              _epciType: "METRO",
            },
          },
          {
            entityName: "famille",
            fieldName: "parisien",
            value: false,
          },
          {
            entityName: "individu",
            fieldName: "ressources",
            id: "demandeur",
            value: [],
          },
          {
            entityName: "individu",
            fieldName: "_interetsAidesVelo",
            id: "demandeur",
            value: ["velo_motorisation"],
          },
          {
            entityName: "individu",
            fieldName: "_interetBafa",
            id: "demandeur",
            value: false,
          },
          {
            entityName: "individu",
            fieldName: "_interetPermisDeConduire",
            id: "demandeur",
            value: false,
          },
          {
            entityName: "individu",
            fieldName: "_interetAidesSanitaireSocial",
            id: "demandeur",
            value: false,
          },
        ],
        current: [],
      },
    }

    const anonymizedSimulation = anonymizeSimulation(simulation)

    expect(anonymizedSimulation.id).toEqual(anId)
    expect(anonymizedSimulation.status).toEqual(SimulationStatus.Anonymized)
    expect(anonymizedSimulation.answers.current).toEqual([])

    const anonymizedAnswers = anonymizedSimulation.answers.all

    const fieldToAnonymize = [
      "date_naissance",
      "handicap",
      "enceinte",
      "parisien",
    ]

    for (const fieldName of fieldToAnonymize) {
      expect(anonymizedAnswers.find((a) => a.fieldName === fieldName)).toEqual(
        undefined,
      )
    }

    expect(anonymizedAnswers.find((a) => a.fieldName === "age").value).toEqual(
      29,
    )
  })
})
