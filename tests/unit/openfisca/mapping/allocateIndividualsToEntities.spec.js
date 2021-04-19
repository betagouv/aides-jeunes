var subject = require("../../../../backend/lib/openfisca/mapping")
var expect = require("expect")

describe("openfisca allocateIndividualsToEntities", function () {
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
    subject.allocateIndividualsToEntities(situation)

    it("sets a single parent", function () {
      expect(situation.famille.parents).toEqual(["demandeur"])
    })
  })

  describe("single parent with one kid", function () {
    var situation = buildSituation({
      demandeur: { id: "demandeur" },
      enfants: [{ id: "e1" }],
    })
    subject.allocateIndividualsToEntities(situation)

    it("sets a single parent", function () {
      expect(situation.famille.parents).toEqual([situation.demandeur.id])
    })

    it("sets a single item array for the kid", function () {
      expect(situation.famille.enfants).toEqual([situation.enfants[0].id])
    })
  })

  describe("single adult within parental fiscal unit", function () {
    var situation = buildSituation({
      demandeur: {
        id: "demandeur",
        enfant_a_charge: { 2013: true },
      },
    })
    subject.allocateIndividualsToEntities(situation)

    it("sets no declarant", function () {
      expect(situation.foyer_fiscal.declarants).toEqual([])
    })
    it("sets one personne a charge", function () {
      expect(situation.foyer_fiscal.personnes_a_charge).toEqual([
        situation.demandeur.id,
      ])
    })
  })

  describe("young adult with one kid within parental fiscal unit", function () {
    var situation = buildSituation({
      demandeur: {
        id: "demandeur",
        enfant_a_charge: { 2013: true },
      },
      enfants: [{ id: "e1" }],
    })
    subject.allocateIndividualsToEntities(situation)

    it("sets no declarant", function () {
      expect(situation.foyer_fiscal.declarants).toEqual([])
    })
    it("sets two personne a charge", function () {
      expect(situation.foyer_fiscal.personnes_a_charge).toEqual([
        situation.demandeur.id,
        situation.enfants[0].id,
      ])
    })
  })
})
