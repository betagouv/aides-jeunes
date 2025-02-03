import { expect } from "@jest/globals"
import { ScolariteEnfant } from "@lib/enums/scolarite.js"
import subject from "@root/backend/lib/openfisca/mapping/index.js"

describe("openfisca dispatchIndividuals", function () {
  function buildSituation(props) {
    return {
      famille: {},
      menage: {},
      ...props,
    }
  }

  describe("single adult", function () {
    const situation = buildSituation({
      demandeur: { id: "demandeur" },
    })
    const result: any = subject.dispatchIndividuals(situation)

    it("sets a single parent", function () {
      expect(result.familles._.parents).toEqual(["demandeur"])
    })
  })

  describe("single parent with one kid", function () {
    const situation = buildSituation({
      demandeur: { id: "demandeur" },
      enfants: [{ id: "e1" }],
    })
    const result: any = subject.dispatchIndividuals(situation)

    it("sets a single parent", function () {
      expect(result.familles._.parents).toEqual([situation.demandeur.id])
    })

    it("sets a single item array for the kid", function () {
      expect(result.familles._.enfants).toEqual([situation.enfants[0].id])
    })
  })

  describe("single adult within parental fiscal unit", function () {
    const situation = buildSituation({
      demandeur: {
        id: "demandeur",
        enfant_a_charge: { 2013: true },
      },
    })
    const result: any = subject.dispatchIndividuals(situation)

    it("adds a parent without", function () {
      expect(result.individus.parent1).toEqual({})
    })
    it("sets a fake declarant", function () {
      expect(result.foyers_fiscaux._.declarants).toEqual(["parent1"])
    })
    it("sets one person a charge", function () {
      expect(result.foyers_fiscaux._.personnes_a_charge).toEqual([
        situation.demandeur.id,
      ])
    })
  })

  describe("young adult in a couple fiscal unit", function () {
    const situation = buildSituation({
      demandeur: {
        id: "demandeur",
        enfant_a_charge: {
          2008: true,
        },
      },
      conjoint: {
        id: "conjoint",
      },
    })
    const result: any = subject.dispatchIndividuals(situation)

    it("sets a fake declarant", function () {
      expect(result.foyers_fiscaux._.declarants).toEqual(["parent1"])
    })
    it("check personnes_a_charge status", function () {
      expect(result.foyers_fiscaux._.personnes_a_charge).toEqual([
        situation.demandeur.id,
      ])
    })
    it("creates a separate foyer_fiscal for the conjoint one person a charge", function () {
      expect(result.foyers_fiscaux.conjoint.declarants).toEqual([
        situation.conjoint.id,
      ])
    })
  })

  describe("check child schooling", function () {
    const situation = buildSituation({
      demandeur: {
        id: "demandeur",
      },
      enfants: [
        {
          id: "enfant_0",
          enfant_a_charge: { 2018: true },
          scolarite: ScolariteEnfant.Maternelle,
        },
      ],
    })
    const result: any = subject.dispatchIndividuals(situation)
    it("checks schooling", function () {
      expect(result.individus.enfant_0.scolarite).toEqual(
        situation.enfants[0].scolarite
      )
    })
  })
})
