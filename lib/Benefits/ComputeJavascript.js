const moment = require("moment")
const { generator } = require("../Dates")
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const { filterByInterestFlag } = require("./FilterInterestFlag")

const PROFILE_STATEGY = {
  apprenti: ({ situation }) => {
    return situation.demandeur._contrat_alternant === "apprenti"
  },
  chomeur: ({ situation }) => {
    return situation.demandeur.activite === "chomeur"
  },
  etudiant: ({ situation }) => {
    return situation.demandeur.activite === "etudiant"
  },
  inactif: ({ situation }) => {
    return situation.demandeur.activite === "inactif"
  },
  independant: ({ situation }) => {
    return situation.demandeur.activite === "independant"
  },
  lyceen: ({ situation }) => {
    return situation.demandeur.scolarite === "lycee"
  },
  professionnalisation: ({ situation }) => {
    return situation.demandeur._contrat_alternant === "professionnalisation"
  },
  salarie: ({ situation }) => {
    return situation.demandeur.activite === "salarie"
  },
  service_civique: ({ situation }) => {
    return situation.demandeur.activite === "service_civique"
  },
}

const OPERATOR = {
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "=": (a, b) => a === b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
}

const COMMUNES_PARAMETERS = {
  regions: "region",
  departements: "departement",
  communes: "code",
}

function testGeographicalEligibility(condition, { commune }) {
  // Pas de contrainte géographique
  if (!condition.values || condition.values.length === 0) {
    return true
  }

  // Depcom invalide
  if (!commune) {
    return false
  }

  const communesParameters = COMMUNES_PARAMETERS[condition.type]

  return condition.values.includes(commune[communesParameters])
}

function handleNot(test, not) {
  return test !== Boolean(not)
}

const CONDITION_STATEGY = {
  boursier: {
    test: (condition, { openfiscaResponse, periods }) => {
      return (
        openfiscaResponse.individus.demandeur.boursier &&
        openfiscaResponse.individus.demandeur.boursier[periods.thisMonth.id] ===
          condition.value
      )
    },
    extra: [{ id: "boursier", entity: "individus", type: "bool" }],
  },
  mention_baccalaureat: {
    test: (condition, { situation }) => {
      return condition.values.includes(situation.demandeur.mention_baccalaureat)
    },
  },
  age: {
    test: (condition, { age }) => {
      return OPERATOR[condition.operator](age, condition.value)
    },
  },
  regions: {
    test: testGeographicalEligibility,
  },
  departements: {
    test: testGeographicalEligibility,
  },
  communes: {
    test: testGeographicalEligibility,
  },
  annee_etude: {
    test: (condition, { situation }) => {
      return condition.values.includes(situation.demandeur.annee_etude)
    },
  },
  regime_securite_sociale: {
    test: (condition, { situation }) => {
      return handleNot(
        condition.value === situation.demandeur.regime_securite_sociale,
        condition.not
      )
    },
  },
}

function testConditions(conditions, data) {
  if (!conditions) {
    return true
  }

  return conditions.every((condition) =>
    CONDITION_STATEGY[condition.type].test(condition, data)
  )
}

function testProfileEligibility(benefit, data) {
  return (
    benefit.profils === undefined ||
    benefit.profils.length === 0 ||
    benefit.profils.some((profil) => {
      return (
        PROFILE_STATEGY[profil.type](data) &&
        testConditions(profil.conditions, data)
      )
    })
  )
}

function computeJavascriptBenefits(benefits, situation, openfiscaResponse) {
  const age = moment(situation.dateDeValeur).diff(
    situation.demandeur.date_naissance,
    "years"
  )
  const periods = generator(situation.dateDeValeur)
  const commune = communes.find((com) => com.code === situation.menage.depcom)
  const data = { situation, openfiscaResponse, periods, age, commune }

  benefits.all
    .filter(
      (benefit) =>
        benefit.computesLocally &&
        filterByInterestFlag(benefit, situation.demandeur)
    )
    .forEach(function (benefit) {
      const profileEligibility = testProfileEligibility(benefit, data)

      const generalConditionsEligibility = testConditions(
        benefit.conditions_generales,
        data
      )

      const montant = benefit.montant

      const eligibility = profileEligibility && generalConditionsEligibility

      const result =
        benefit.type === "float" ? (eligibility ? montant : 0) : eligibility

      openfiscaResponse.individus.demandeur[benefit.id] = {
        [periods.thisMonth.id]: result,
      }
    })
}

exports.CONDITION_STATEGY = CONDITION_STATEGY
exports.testProfileEligibility = testProfileEligibility
exports.testGeographicalEligibility = testGeographicalEligibility
exports.computeJavascriptBenefits = computeJavascriptBenefits
