import dayjs from "dayjs"
import { generator } from "../dates.js"
import { filterByInterestFlag } from "./filter-interest-flag.js"
import Scolarite from "../scolarite.js"

import { situationsLayout } from "lib/types/situations.js"
import { ConditionsLayout } from "lib/types/benefits.js"

const testRSARecipient = ({ openfiscaResponse, periods }): boolean => {
  const rsa = openfiscaResponse.familles._.rsa[periods.thisMonth.id]
  return rsa > 1
}

const PROFILE_STATEGY = {
  apprenti: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation?.demandeur?._contrat_alternant === "apprenti"
  },
  beneficiaire_rsa: (data) => {
    return testRSARecipient(data)
  },
  chomeur: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation.demandeur?.activite === "chomeur"
  },
  etudiant: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation.demandeur?.activite === "etudiant"
  },
  inactif: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation.demandeur?.activite === "inactif"
  },
  independant: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation.demandeur?.activite === "independant"
  },
  enseignement_superieur: ({
    situation,
  }: {
    situation: situationsLayout
  }): boolean => {
    return situation.demandeur?.scolarite === "enseignement_superieur"
  },
  lyceen: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation.demandeur?.scolarite === "lycee"
  },
  professionnalisation: ({
    situation,
  }: {
    situation: situationsLayout
  }): boolean => {
    return situation.demandeur?._contrat_alternant === "professionnalisation"
  },
  salarie: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation.demandeur?.activite === "salarie"
  },
  service_civique: ({
    situation,
  }: {
    situation: situationsLayout
  }): boolean => {
    return situation.demandeur?.activite === "service_civique"
  },
  stagiaire: ({ situation }: { situation: situationsLayout }): boolean => {
    return situation.demandeur?.stagiaire === true
  },
}

const OPERATOR = {
  ">": (a: number, b: number) => a > b,
  ">=": (a: number, b: number) => a >= b,
  "=": (a: number, b: number) => a === b,
  "<": (a: number, b: number) => a < b,
  "<=": (a: number, b: number) => a <= b,
}

const COMMUNE_PARAMETERS = {
  regions: "_region",
  departements: "_departement",
  communes: "depcom",
}

export function testGeographicalEligibility(
  condition: any,
  { situation }: { situation: situationsLayout }
): boolean {
  // Pas de contrainte géographique
  if (!condition.values || condition.values.length === 0) {
    return true
  }

  const communeParameter = COMMUNE_PARAMETERS[condition.type]

  return (
    situation.menage &&
    condition.values.includes(situation.menage[communeParameter])
  )
}

export const CONDITION_STATEGY: ConditionsLayout = {
  boursier: {
    test: (_, { openfiscaResponse, periods }) => {
      return openfiscaResponse.individus.demandeur.boursier?.[
        periods.thisMonth.id
      ]
    },
    extra: [
      {
        id: "boursier",
        entity: "individus",
        type: "bool",
        openfiscaPeriod: "thisMonth",
      },
    ],
  },
  formation_sanitaire_social: {
    test: (_, { situation }: { situation: situationsLayout }) => {
      return (
        situation.demandeur?.groupe_specialites_formation ===
        Scolarite.groupeSpecialitesFormation
          .specialites_plurivalentes_sanitaires_et_sociales.value
      )
    },
  },
  mention_baccalaureat: {
    test: (condition, { situation }: { situation: situationsLayout }) => {
      return condition.values.includes(
        situation.demandeur?.mention_baccalaureat
      )
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
    test: (condition, { situation }: { situation: situationsLayout }) => {
      return condition.values.includes(situation.demandeur?.annee_etude)
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
  quotient_familial: {
    test: (condition, { openfiscaResponse, periods }) => {
      const rfr = openfiscaResponse.foyers_fiscaux._.rfr[periods.fiscalYear.id]
      const nbptr =
        openfiscaResponse.foyers_fiscaux._.nbptr[periods.fiscalYear.id] || 1
      const periodDivider = condition.period === "month" ? 12 : 1
      const quotient_familial = rfr / nbptr / periodDivider
      return quotient_familial <= condition.floor
    },
    extra: [
      {
        id: "rfr",
        entity: "foyers_fiscaux",
        type: "float",
        openfiscaPeriod: "fiscalYear",
      },
      {
        id: "nbptr",
        entity: "foyers_fiscaux",
        type: "float",
        openfiscaPeriod: "fiscalYear",
      },
    ],
  },
  beneficiaire_rsa: {
    test: (_, data) => {
      return testRSARecipient(data)
    },
    extra: [
      {
        id: "rsa",
        entity: "familles",
        type: "float",
        openfiscaPeriod: "thisMonth",
      },
    ],
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

export function testProfileEligibility(benefit, data) {
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

export function computeJavascriptBenefits(
  benefits,
  situation: situationsLayout,
  openfiscaResponse
) {
  const age = dayjs(situation.dateDeValeur).diff(
    situation.demandeur?.date_naissance,
    "year"
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
