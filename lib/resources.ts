"use strict"
import Individu from "./individu.js"
import { generator } from "./dates.js"

import { situationsLayout } from "../lib/types/situations"
import { individuLayout } from "../lib/types/individu"
import { resourceLayout } from "./types/resources"

export const ressourceCategories = [
  {
    id: "revenusActivite",
    label: "Revenus d'activité",
  },
  {
    id: "rpns",
    label: "Revenus professionnels non salariés",
  },
  {
    id: "allocations",
    label: "Allocation(s)",
  },
  {
    id: "indemnites",
    label: "Indemnités",
  },
  {
    id: "pensions",
    label: "Pension(s)",
  },
  {
    id: "patrimoine",
    label: "Revenus du patrimoine",
  },
  {
    id: "autre",
    label: "Autres revenus",
  },
]

export const ressourceTypes: resourceLayout[] = [
  {
    category: "revenusActivite",
    hint: "Entrez le montant avant la retenue à la source",
    id: "salaire_net",
    interuptionQuestionLabel:
      "un salaire, des allocations chômage, ou des indemnités de la sécurité sociale",
    label: "Salaire (dont primes et indemnités de fin de contrat)",
    positionInList: "1",
  },
  {
    category: "revenusActivite",
    id: "indemnites_stage",
    label: "Rémunération de stage",
    prefix: "une",
  },
  {
    category: "revenusActivite",
    id: "revenus_stage_formation_pro",
    label: "Revenus de stage de formation professionnelle",
    prefix: "des",
  },
  {
    category: "allocations",
    hint: "Entrez le montant avant la retenue à la source",
    id: "chomage_net",
    interuptionQuestionLabel:
      "des allocations chômage, un salaire ou des indemnités de la sécurité sociale",
    label: "Allocations chômage (ARE)",
  },
  {
    category: "allocations",
    id: "allocation_securisation_professionnelle",
    label: "Allocation de sécurisation professionnelle",
    prefix: "une",
  },
  {
    category: "allocations",
    id: "prime_forfaitaire_mensuelle_reprise_activite",
    label: "Prime forfaitaire mensuelle pour la reprise d’activité",
    prefix: "une",
  },
  {
    category: "allocations",
    id: "aide_logement",
    label: "Aides au logement (APL, ALS, ALF)",
    prefix: "des",
  },
  {
    category: "allocations",
    id: "af",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return individu.id !== "demandeur" || Boolean(situation.enfants?.length)
    },
    label: "Allocations familiales",
    prefix: "des",
  },
  {
    category: "allocations",
    id: "cf",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return individu.id !== "demandeur" || Boolean(situation.enfants?.length)
    },
    label: "Complément familial (CF)",
    prefix: "le",
  },
  {
    category: "allocations",
    id: "asf",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(situation.enfants?.filter((e) => e.garde_aternee).length)
      )
    },
    label: "Allocation de soutien familial (ASF)",
    prefix: "l’",
  },
  {
    category: "allocations",
    id: "rsa",
    label: "Revenu de solidarité active (RSA)",
    prefix: "le",
  },
  {
    category: "revenusActivite",
    id: "ppa",
    label: "Prime d’activité",
    prefix: "la",
  },
  {
    category: "allocations",
    id: "aspa",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (
        55 <=
        Individu.age(individu, generator(situation.dateDeValeur).today.value)
      )
    },
    label: "Allocation de solidarité aux personnes âgées (ASPA)",
    prefix: "l’",
  },
  {
    category: "allocations",
    id: "asi",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (individu?.handicap && individu.handicap) === true
    },
    label: "Allocation supplémentaire d’invalidité (ASI)",
    prefix: "l’",
  },
  {
    category: "allocations",
    id: "ass",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return individu.activite != "etudiant"
    },
    label: "Allocation de solidarité spécifique (ASS)",
    prefix: "l’",
  },
  {
    category: "allocations",
    id: "aah",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (individu?.handicap && individu.handicap) === true
    },
    label: "Allocation adulte handicapé (AAH)",
    prefix: "l’",
  },
  {
    category: "allocations",
    id: "caah",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (individu?.handicap && individu.handicap) === true
    },
    label: "Complément de ressources adulte handicapé",
    prefix: "le",
    sourceOpenfisca:
      "prestations.minima_sociaux.caah.montant_complement_ressources",
  },
  {
    category: "allocations",
    id: "contrat_engagement_jeune",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      const age = Individu.age(
        individu,
        generator(situation.dateDeValeur).today.value
      )
      return Boolean(
        16 <= age && (age <= 25 || (individu.handicap && age < 30))
      )
    },
    label: "Contrat engagement jeune",
    prefix: "le",
  },
  {
    category: "allocations",
    id: "mva",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (individu?.handicap && individu.handicap) === true
    },
    label: "Majoration pour vie autonome (MVA)",
    prefix: "la",
    sourceOpenfisca: "prestations.minima_sociaux.caah.majoration_vie_autonome",
  },
  {
    category: "allocations",
    id: "aeeh",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(situation.enfants?.filter((enfant) => enfant.handicap).length)
      )
    },
    label: "Allocation d’éducation de l’enfant handicapé (AEEH)",
    prefix: "l’",
  },
  {
    category: "allocations",
    id: "pch",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return (
        individu.handicap ||
        Boolean(situation.enfants?.filter((enfant) => enfant.handicap).length)
      )
    },
    label: "Prestation de compensation du handicap (PCH)",
    prefix: "la",
  },
  {
    category: "allocations",
    id: "paje_base",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return individu.id !== "demandeur" || Boolean(situation.enfants?.length)
    },
    label: "Prestation d’accueil du jeune enfant (PAJE) - Allocation de base",
    prefix: "la",
  },
  {
    category: "allocations",
    id: "paje_clca",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return individu.id !== "demandeur" || Boolean(situation.enfants?.length)
    },
    label: "Complément de libre choix d’activité (CLCA)",
    prefix: "le",
  },
  {
    category: "allocations",
    id: "paje_prepare",
    isRelevant: (situation: situationsLayout, individu: individuLayout) => {
      return individu.id !== "demandeur" || Boolean(situation.enfants?.length)
    },
    label: "Prestation partagée d’éducation de l’enfant (PreParE)",
    prefix: "la",
  },
  {
    category: "indemnites",
    id: "indemnites_journalieres_maternite",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
    isRelevant: (situation) => situation.enfants?.length,
    label: "Indemnités de maternité, paternité, adoption",
  },
  {
    category: "indemnites",
    hint: "Entrez le montant avant la retenue à la source",
    id: "indemnites_journalieres_maladie",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
    label: "Indemnités maladie",
  },
  {
    category: "indemnites",
    id: "indemnites_journalieres_maladie_professionnelle",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
    label: "Indemnités maladie professionnelle",
  },
  {
    category: "indemnites",
    id: "indemnites_journalieres_accident_travail",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
    label: "Indemnités d’accident du travail",
  },
  {
    category: "indemnites",
    id: "indemnites_chomage_partiel",
    label: "Indemnités d’activité partielle",
    prefix: "des",
  },
  {
    category: "indemnites",
    id: "indemnites_volontariat",
    label: "Indemnités de volontariat",
    prefix: "des",
  },
  {
    category: "indemnites",
    id: "dedommagement_victime_amiante",
    label: "Dédommagement aux victimes de l’amiante",
    prefix: "un",
  },
  {
    category: "pensions",
    id: "pensions_alimentaires_percues",
    label: "Pension alimentaire",
    prefix: "une",
  },
  {
    category: "pensions",
    id: "pensions_alimentaires_versees_individu",
    interuptionQuestionLabel: "une pension alimentaire",
    label: "Pension alimentaire versée",
  },
  {
    category: "pensions",
    id: "prestation_compensatoire",
    label: "Prestation compensatoire (suite à séparation)",
    prefix: "une",
  },
  {
    category: "pensions",
    hint: "Entrez le montant avant la retenue à la source",
    id: "retraite_nette",
    isRelevant(situation: situationsLayout, individu: individuLayout) {
      return individu.activite === "retraite"
    },
    label: "Retraite (y compris reversion), rente",
    prefix: "une",
  },
  {
    category: "pensions",
    id: "retraite_combattant",
    isRelevant(situation: situationsLayout, individu: individuLayout) {
      return individu.activite === "retraite"
    },
    label: "Retraite du combattant",
    prefix: "une",
  },
  {
    category: "pensions",
    id: "pensions_invalidite",
    label: "Pension d’invalidité",
    prefix: "une",
  },
  {
    category: "autre",
    id: "bourse_enseignement_sup",
    label: "Bourse de l’enseignement supérieur",
    prefix: "une",
  },
  {
    category: "autre",
    id: "bourse_recherche",
    label: "Bourse de recherche",
    prefix: "une",
  },
  {
    category: "autre",
    id: "bourse_lycee",
    label: "Bourse du lycée",
    prefix: "une",
  },
  {
    category: "autre",
    id: "gains_exceptionnels",
    label: "Gains exceptionnels (dons, gains aux jeux, héritage)",
    prefix: "des",
  },
  {
    category: "patrimoine",
    id: "revenus_locatifs",
    label: "Revenus locatifs (terrains, appartements, SCI…)",
    prefix: "des",
  },
  {
    category: "patrimoine",
    id: "revenus_capital",
    label: "Revenus du capital (intérêts, plus-values, dividendes…)",
    prefix: "des",
  },
  {
    category: "rpns",
    id: "rpns_micro_entreprise_CA_bic_vente_imp",
    isMontantAnnuel: true,
    label: "Via une micro-entreprise (Achat/revente ou fourniture de logement)",
  },
  {
    category: "rpns",
    id: "rpns_micro_entreprise_CA_bic_service_imp",
    isMontantAnnuel: true,
    label: "Via une micro-entreprise (Autre activité relevant des BIC)",
  },
  {
    category: "rpns",
    id: "rpns_micro_entreprise_CA_bnc_imp",
    isMontantAnnuel: true,
    label:
      "Via une micro-entreprise (Activité libérale et/ou intellectuelle (BNC))",
  },
  {
    category: "rpns",
    id: "rpns_benefice_exploitant_agricole",
    isMontantAnnuel: true,
    label: "En tant qu'exploitant agricole",
  },
  {
    category: "rpns",
    extra: [
      {
        default: "bic",
        id: "tns_autres_revenus_type_activite",
        openfiscaPeriod: "thisMonth",
      },
    ],
    id: "rpns_autres_revenus",
    isMontantAnnuel: true,
    label: "En profession libérale (entrepreneur)",
  },
]

export const categoriesRnc = [
  {
    id: "salaire_imposable",
    label: "Revenus d’activité connus",
    sources: ["salaire_net"],
  },
  {
    id: "chomage_imposable",
    label: "Autres revenus imposables (préretraite, chômage)",
    sources: ["chomage_net"],
  },
  {
    id: "retraite_imposable",
    label: "Pensions, retraites, rentes",
    sources: ["retraite_nette", "retraite_combattant", "pensions_invalidite"],
  },
  {
    id: "frais_reels",
    label: "Frais réels déductibles",
    yearly: true,
  },
  {
    id: "pensions_alimentaires_percues",
    label: "Pensions alimentaires reçues",
    sources: ["pensions_alimentaires_percues"],
  },
  {
    id: "pensions_alimentaires_versees",
    label: "Pensions alimentaires versées",
    sources: ["pensions_alimentaires_versees_individu"],
    yearly: true,
  },
  {
    id: "revenus_locatifs",
    label: "Revenus fonciers nets",
    sources: ["revenus_locatifs"],
  },
]

export const patrimoineTypes = [
  {
    id: "valeur_patrimoine_loue",
    label: "Valeur de vos biens loués",
  },
  {
    id: "valeur_terrains_non_loues",
    label: "Valeur de vos terrains non loués",
  },
  {
    id: "valeur_locative_terrains_non_loues",
    label: "Valeur locative terrains non loués",
  },
  {
    id: "valeur_immo_non_loue",
    label: "Valeur de vos biens immobiliers non loués",
  },
  {
    id: "valeur_locative_immo_non_loue",
    label: "Valeur locative immobilier non loué",
  },
  {
    id: "livret_a",
    label: "Épargne sur livret A",
  },
  {
    id: "epargne_revenus_non_imposables",
    label: "Épargne aux revenus non imposables",
  },
  {
    id: "epargne_revenus_imposables",
    label: "Épargne aux revenus imposables",
  },
]

export default {
  categoriesRnc,
  patrimoineTypes,
  ressourceCategories,
  ressourceTypes,
}
