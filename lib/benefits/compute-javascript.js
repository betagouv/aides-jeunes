const moment = require("moment")
const { generator } = require("../dates")
const { filterByInterestFlag } = require("./filter-interest-flag")

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
  enseignement_superieur: ({ situation }) => {
    return situation.demandeur.scolarite === "enseignement_superieur"
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
  stagiaire: ({ situation }) => {
    return situation.demandeur.stagiaire
  },
}

const OPERATOR = {
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "=": (a, b) => a === b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
}

const COMMUNE_PARAMETERS = {
  regions: "_region",
  departements: "_departement",
  communes: "depcom",
}

function testGeographicalEligibility(condition, { situation }) {
  // Pas de contrainte géographique
  if (!condition.values || condition.values.length === 0) {
    return true
  }

  const communeParameter = COMMUNE_PARAMETERS[condition.type]

  return condition.values.includes(situation.menage[communeParameter])
}

const CONDITION_STATEGY = {
  boursier: {
    test: (condition, { openfiscaResponse, periods }) => {
      return (
        openfiscaResponse.individus.demandeur.boursier?.[
          periods.thisMonth.id
        ] === condition.value
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
    test: (condition, { openfiscaResponse }) => {
      const includes =
        !condition.includes ||
        condition.includes.length === 0 ||
        condition.includes.includes(
          openfiscaResponse.individus.demandeur.regime_securite_sociale
        )
      const excludes =
        !condition.excludes ||
        condition.excludes.length === 0 ||
        !condition.excludes.includes(
          openfiscaResponse.individus.demandeur.regime_securite_sociale
        )
      return includes && excludes
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
  const data = { situation, openfiscaResponse, periods, age }

  benefits.all
    .filter(
      (benefit) =>
        benefit.source === "javascript" &&
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
