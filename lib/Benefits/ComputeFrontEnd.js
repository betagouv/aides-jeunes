const moment = require("moment")
const { generator } = require("../Dates")
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const { filterByInterestFlag } = require("./FilterInterestFlag")

const PROFILE_STATEGY = {
  apprenti: (situation) => {
    return situation.demandeur._contrat_alternant === "apprenti"
  },
  chomeur: (situation) => {
    return situation.demandeur.activite === "chomeur"
  },
  etudiant: (situation) => {
    return situation.demandeur.activite === "etudiant"
  },
  inactif: (situation) => {
    return situation.demandeur.activite === "inactif"
  },
  independant: (situation) => {
    return situation.demandeur.activite === "independant"
  },
  lyceen: (situation) => {
    return ["seconde", "premiere", "terminale"].includes(
      situation.demandeur.annee_etude
    )
  },
  professionnalisation: (situation) => {
    return situation.demandeur._contrat_alternant === "professionnalisation"
  },
  salarie: (situation) => {
    return situation.demandeur.activite === "salarie"
  },
  service_civique: (situation) => {
    return situation.demandeur.activite === "service_civique"
  },
}

const CONDITION_STATEGY = {
  boursier: (situation, value) => {
    return (
      situation.demandeur.boursier === value ||
      situation.demandeur.bourse_lycee === value
    )
  },
  mention_baccalaureat: (situation, values) => {
    return values.includes(situation.demandeur.mention_baccalaureat)
  },
}

function testProfileConditions(situation, conditions) {
  if (!conditions) {
    return true
  }

  return conditions.every((condition) =>
    CONDITION_STATEGY[condition.type](
      situation,
      condition.value || condition.values
    )
  )
}

function testProfileEligibility(situation, benefit) {
  return (
    benefit.profils === undefined ||
    benefit.profils.some((profil) => {
      return (
        PROFILE_STATEGY[profil.type](situation) &&
        testProfileConditions(situation, profil.conditions)
      )
    })
  )
}

function testGeographicalEligibility(commune, benefit) {
  const tests = [
    { item: "code", list: benefit.communes || [] },
    { item: "departement", list: benefit.departements || [] },
    { item: "region", list: benefit.regions || [] },
  ]

  // Pas de contrainte géographique
  if (tests.every((test) => test.list.length === 0)) {
    return true
  }

  // Depcom invalide
  if (!commune) {
    return false
  }

  return tests.some((test) => test.list.includes(commune[test.item]))
}

function computeFrontEndBenefits(
  droitsDescription,
  situation,
  openfiscaResponse
) {
  const age = moment().diff(situation.demandeur.date_naissance, "years")
  const period = generator(situation.dateDeValeur).thisMonth.id
  const commune = communes.find((com) => com.code === situation.menage.depcom)

  droitsDescription.forEach(function (benefit, benefitId) {
    if (
      benefit.computesLocally &&
      filterByInterestFlag(benefit, situation.demandeur)
    ) {
      const elegibiliteAge =
        (benefit.age_min === undefined || age >= benefit.age_min) &&
        (benefit.age_max === undefined || age <= benefit.age_max)

      const eligibiliteProfils = testProfileEligibility(situation, benefit)

      const eligibiliteGeo = testGeographicalEligibility(commune, benefit)

      const montant = benefit.montant

      const eligibilite = eligibiliteProfils && elegibiliteAge && eligibiliteGeo

      const result =
        benefit.type === "float" ? (eligibilite ? montant : 0) : eligibilite

      openfiscaResponse.individus.demandeur[benefitId] = { [period]: result }
    }
  })
}

exports.testProfileEligibility = testProfileEligibility
exports.testGeographicalEligibility = testGeographicalEligibility
exports.computeFrontEndBenefits = computeFrontEndBenefits
