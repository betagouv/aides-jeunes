import { expect } from "@jest/globals"

import Migration from "@backend/lib/migrations/simulations/to-v15.js"

describe("Migration apply", () => {
  const createSimulation = (allAnswers, currentAnswers) => ({
    answers: { all: allAnswers, current: currentAnswers },
    dateDeValeur: new Date("2023-01-01"),
  })

  it("transform both all and current answers correctly when activite is service_civique", () => {
    const simulation = createSimulation(
      [
        { id: "demandeur", fieldName: "activite", value: "service_civique" },
        { id: "demandeur", fieldName: "handicap", value: false },
      ],
      [
        { id: "demandeur", fieldName: "activite", value: "service_civique" },
        { id: "demandeur", fieldName: "handicap", value: false },
      ]
    )

    const expectedAnswers = {
      all: [
        { id: "demandeur", fieldName: "activite", value: "inactif" },
        {
          entityName: "individu",
          fieldName: "service_civique",
          id: "demandeur",
          value: true,
        },
        { id: "demandeur", fieldName: "handicap", value: false },
      ],
      current: [
        { id: "demandeur", fieldName: "activite", value: "inactif" },
        {
          entityName: "individu",
          fieldName: "service_civique",
          id: "demandeur",
          value: true,
        },
        { id: "demandeur", fieldName: "handicap", value: false },
      ],
    }

    const result = Migration.apply(simulation)

    expect(result.answers.all).toEqual(expectedAnswers.all)
    expect(result.answers.current).toEqual(expectedAnswers.current)
  })

  describe("when activite is not service_civique", () => {
    it("do not modify answers when age > 31", () => {
      const simulation = createSimulation(
        [
          { id: "demandeur", fieldName: "age", value: 35 },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          { id: "demandeur", fieldName: "handicap", value: false },
        ],
        [
          { id: "demandeur", fieldName: "age", value: 35 },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          { id: "demandeur", fieldName: "handicap", value: false },
        ]
      )

      const expectedAnswers = {
        all: [
          { id: "demandeur", fieldName: "age", value: 35 },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          { id: "demandeur", fieldName: "handicap", value: false },
        ],
        current: [
          { id: "demandeur", fieldName: "age", value: 35 },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          { id: "demandeur", fieldName: "handicap", value: false },
        ],
      }

      const result = Migration.apply(simulation)

      expect(result.answers.all).toEqual(expectedAnswers.all)
      expect(result.answers.current).toEqual(expectedAnswers.current)
    })

    it("add service_civique (false) answer when age < 31", () => {
      const simulation = createSimulation(
        [
          { id: "demandeur", fieldName: "date_naissance", value: "2000-01-01" },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          { id: "demandeur", fieldName: "handicap", value: false },
        ],
        [
          { id: "demandeur", fieldName: "date_naissance", value: "2000-01-01" },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          { id: "demandeur", fieldName: "handicap", value: false },
        ]
      )

      const expectedAnswers = {
        all: [
          { id: "demandeur", fieldName: "date_naissance", value: "2000-01-01" },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          {
            entityName: "individu",
            fieldName: "service_civique",
            id: "demandeur",
            value: false,
          },
          { id: "demandeur", fieldName: "handicap", value: false },
        ],
        current: [
          { id: "demandeur", fieldName: "date_naissance", value: "2000-01-01" },
          { id: "demandeur", fieldName: "activite", value: "other_activity" },
          {
            entityName: "individu",
            fieldName: "service_civique",
            id: "demandeur",
            value: false,
          },
          { id: "demandeur", fieldName: "handicap", value: false },
        ],
      }

      const result = Migration.apply(simulation)

      expect(result.answers.all).toEqual(expectedAnswers.all)
      expect(result.answers.current).toEqual(expectedAnswers.current)
    })
  })
})
