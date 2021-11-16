import { computeAides } from "../../lib/Benefits/Compute"
import BenefitsData from "@/../data/js/benefits/back"

const compute = computeAides.bind(BenefitsData)

describe("computeAides", function () {
  let droits, situation, openfiscaResult

  beforeEach(function () {
    situation = {
      dateDeValeur: "2014-11-01",
      demandeur: {
        aah: {
          "2014-11": 100,
        },
        aide_logement: {
          "2014-11": 100,
        },
      },
      conjoint: {
        ppa: {
          "2014-11": 100,
        },
      },
      famille: {},
      menage: {},
    }

    openfiscaResult = {
      familles: {
        _: {
          rsa_non_calculable: {
            "2014-11": "error",
          },
          paris_logement_familles: {
            "2014-11": 10,
          },
          alfortville_noel_enfants: {
            "2014-11": 10,
          },
          css_participation_forfaitaire: {
            "2014-11": 10,
          },
        },
      },
      menages: {
        _: {
          personne_de_reference: ["demandeur"],
          depcom: {
            "2014-11": "00000",
          },
        },
      },
      individus: {
        demandeur: {
          logement_social_eligible: {
            "2014-11": false,
          },
        },
      },
      foyers_fiscaux: {},
    }
  })

  describe("computeAides injected values", function () {
    let ids

    beforeEach(function () {
      droits = compute(situation, "id", openfiscaResult)
      ids = droits.droitsInjectes.map((d) => d.id)
    })

    it("should extract injected droits", function () {
      expect(ids).toContain("aah")
      expect(ids).toContain("aide_logement")
      expect(ids).toContain("ppa")
    })

    it("should not have injected droits duplicates", function () {
      expect(
        ids.filter(function (d) {
          return d == "aah"
        }).length
      ).toEqual(1)
    })
  })

  describe("computeAides of numeric value", function () {
    beforeEach(function () {
      droits = compute(situation, "id", openfiscaResult)
    })

    it("should extract droits from openfisca result", function () {
      const css = droits.droitsEligibles.find(function (element) {
        return element.id === "css_participation_forfaitaire"
      })
      expect(css).toBeTruthy()
      expect(css.montant).toEqual(10)
      expect(css.provider.label).toEqual("Assurance maladie")

      const plf = droits.droitsEligibles.find(function (element) {
        return element.id === "paris_logement_familles"
      })
      expect(plf).toBeTruthy()
      expect(plf.provider.label).toEqual("Ville de Paris")
      expect(plf.montant).toEqual(10)
    })
  })

  describe("computeAides of true boolean values", function () {
    beforeEach(function () {
      openfiscaResult.individus.demandeur.logement_social_eligible = {
        "2014-11": true,
      }
      droits = compute(situation, "id", openfiscaResult, true)
    })

    it("should extract eligibles droits from openfisca result", function () {
      const logement_social = droits.droitsEligibles.find(function (element) {
        return element.id === "logement_social_eligible"
      })
      expect(logement_social).toBeTruthy()
      expect(logement_social.montant).toBeTruthy()
    })
  })

  describe("computeAides uncomputability highlighted", function () {
    beforeEach(function () {
      droits = compute(situation, "id", openfiscaResult)
    })

    it("should extract reason of uncomputability", function () {
      const rsa = droits.droitsEligibles.find(function (element) {
        return element.id === "rsa"
      })
      expect(rsa.montant).toEqual("error")
    })
  })

  describe("computeAides extraction of local partenaire without prestation", function () {
    beforeEach(function () {
      droits = compute(situation, "id", openfiscaResult)
    })

    it("should exclude local partenaire without prestation", function () {
      expect(
        droits.droitsEligibles.filter(function (p) {
          return p.provider.label == "Rennes Métropole"
        }).length
      ).toBeFalsy()
    })
  })

  describe("computeAides exclude private aids", function () {
    beforeEach(function () {
      droits = compute(situation, "id", openfiscaResult)
    })

    it("should exclude private aid", function () {
      const private_aid = droits.droitsEligibles.find(function (element) {
        return element.id === "alfortville_noel_enfants"
      })
      expect(private_aid).toBeFalsy()
    })
  })

  describe("computeAides of mixed values", () => {
    it("should extract boolean values", () => {
      openfiscaResult.familles._.css_participation_forfaitaire = {
        "2014-11": 0,
      }
      openfiscaResult.familles._.cmu_c = {
        "2014-11": true,
      }
      droits = compute(situation, "id", openfiscaResult)

      const css = droits.droitsEligibles.find(
        (droit) => droit.id === "css_participation_forfaitaire"
      )

      expect(css.montant).toEqual(true)
    })

    it("should extract number values", () => {
      openfiscaResult.familles._.cmu_c = {
        "2014-11": false,
      }
      droits = compute(situation, "id", openfiscaResult)

      const css = droits.droitsEligibles.find(
        (droit) => droit.id === "css_participation_forfaitaire"
      )

      expect(css.montant).toEqual(10)
    })
  })
})
