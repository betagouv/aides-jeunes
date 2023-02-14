import dayjs from "dayjs"
import { generator } from "../dates.js"
import { filterByInterestFlag } from "./filter-interest-flag.js"
import Scolarite from "../scolarite.js"

import { situationsLayout } from "../types/situations.js"
import { ConditionsLayout } from "../types/benefits.js"

const testRSARecipient = ({ openfiscaResponse, periods }): boolean => {
  const rsa = openfiscaResponse.familles._.rsa[periods.thisMonth.id]
  return rsa > 1
}

const includesAndExcludesCondition = (condition, value) => {
  const includes =
    !(condition && condition?.includes?.length) ||
    condition.includes.includes(value)
  const excludes =
    !(condition && condition?.excludes?.length) ||
    !condition.excludes.includes(value)
  return includes && excludes
}
const PROFILE_STRATEGY = {
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
  situation_handicap: ({
    situation,
  }: {
    situation: situationsLayout
  }): boolean => {
    return situation.demandeur?.handicap === true
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
  epcis: "_epci",
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

export const CONDITION_STRATEGY: ConditionsLayout = {
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
  attached_to_institution: {
    test: (
      _,
      {
        situation,
      }: {
        situation: situationsLayout
      },
      benefit
    ): boolean => {
      const institution = benefit.institution

      switch (institution.type) {
        case "region":
          return situation.menage._region === institution.code_insee
        case "departement":
          return situation.menage._departement === institution.code_insee
        case "epci":
          return situation.menage._epci === institution.code_siren
        case "commune":
          return situation.menage.depcom === institution.code_insee
      }
      return false
    },
  },
  not: {
    test: (condition, props) => {
      return !CONDITION_STRATEGY[condition.value.type].test(
        condition.value,
        props
      )
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
  epcis: {
    test: testGeographicalEligibility,
  },
  annee_etude: {
    test: (condition, { situation }: { situation: situationsLayout }) => {
      return condition.values.includes(situation.demandeur?.annee_etude)
    },
  },
  regime_securite_sociale: {
    test: (condition, { openfiscaResponse }) => {
      return includesAndExcludesCondition(
        condition,
        openfiscaResponse.individus.demandeur.regime_securite_sociale
      )
    },
  },
  statut_occupation_logement: {
    test: (condition, { situation }) => {
      return includesAndExcludesCondition(
        condition,
        situation.menage.statut_occupation_logement
      )
    },
  },
  quotient_familial: {
    test: (condition, { openfiscaResponse, periods }) => {
      const rfr = openfiscaResponse.foyers_fiscaux._.rfr[periods.fiscalYear.id]
      const nbptr =
        openfiscaResponse.foyers_fiscaux._.nbptr[periods.fiscalYear.id] || 1
      const periodDivider = condition.period === "month" ? 12 : 1
      const quotient_familial = rfr / nbptr / periodDivider
      return OPERATOR[condition.operator](quotient_familial, condition.value)
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
  taux_incapacite: {
    test: (condition, { situation }: { situation: situationsLayout }) => {
      const taux_incapacite = situation?.demandeur?.taux_incapacite || 0
      return condition.values.some((value) => {
        switch (value) {
          case "inferieur_50":
            return taux_incapacite < 0.5
          case "entre_50_et_80":
            return taux_incapacite >= 0.5 && taux_incapacite <= 0.8
          case "superieur_80":
            return taux_incapacite > 0.8
          default:
            return false
        }
      })
    },
  },
}

function testConditions(conditions, data, benefit) {
  if (!conditions) {
    return true
  }

  return conditions.every((condition) =>
    CONDITION_STRATEGY[condition.type].test(condition, data, benefit)
  )
}

export function testProfileEligibility(benefit, data) {
  return (
    benefit.profils === undefined ||
    benefit.profils.length === 0 ||
    benefit.profils.some((profil) => {
      return (
        PROFILE_STRATEGY[profil.type](data) &&
        testConditions(profil.conditions, data, benefit)
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
        data,
        benefit
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
