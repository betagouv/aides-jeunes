var subject = require("../../../../backend/lib/openfisca/mapping")
var expect = require("expect")

describe("openfisca dispatchIndividuals", function () {
  function buildSituation(props) {
    return {
      famille: {},
      foyer_fiscal: {},
      menage: {},
      ...props,
    }
  }

  describe("single adult", function () {
    var situation = buildSituation({
      demandeur: { id: "demandeur" },
    })
    var result = subject.dispatchIndividuals(situation)

    it("sets a single parent", function () {
      expect(result.familles._.parents).toEqual(["demandeur"])
    })
  })

  describe("single parent with one kid", function () {
    var situation = buildSituation({
      demandeur: { id: "demandeur" },
      enfants: [{ id: "e1" }],
    })
    var result = subject.dispatchIndividuals(situation)

    it("sets a single parent", function () {
      expect(result.familles._.parents).toEqual([situation.demandeur.id])
    })

    it("sets a single item array for the kid", function () {
      expect(result.familles._.enfants).toEqual([situation.enfants[0].id])
    })
  })

  describe("single adult within parental fiscal unit", function () {
    var situation = buildSituation({
      demandeur: {
        id: "demandeur",
        enfant_a_charge: { 2013: true },
      },
    })
    var result = subject.dispatchIndividuals(situation)

    it("adds a parent without", function () {
      expect(result.individus.parent1).toEqual({})
    })
    it("sets a fake declarant", function () {
      expect(result.foyers_fiscaux._.declarants).toEqual(["parent1"])
    })
    it("sets one personne a charge", function () {
      expect(result.foyers_fiscaux._.personnes_a_charge).toEqual([
        situation.demandeur.id,
      ])
    })
  })

  describe("young adult in a couple fiscal unit", function () {
    var situation = buildSituation({
      demandeur: {
        id: "demandeur",
        enfant_a_charge: { 2013: true },
      },
      conjoint: {
        id: "conjoint",
      },
    })
    var result = subject.dispatchIndividuals(situation)

    it("sets a fake declarant", function () {
      expect(result.foyers_fiscaux._.declarants).toEqual(["parent1"])
    })
    it("sets one persone a charge", function () {
      expect(result.foyers_fiscaux._.personnes_a_charge).toEqual([
        situation.demandeur.id,
      ])
    })
    it("creates a separate foyer_fiscal for the conjoint one persone a charge", function () {
      expect(result.foyers_fiscaux.conjoint.declarants).toEqual([
        situation.conjoint.id,
      ])
    })
  })
})
