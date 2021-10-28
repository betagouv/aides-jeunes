"use strict"
const Individu = require("../lib/Individu")
const datesGenerator = require("../../lib/helpers/Dates").generator

let ressourceCategories = [
  {
    id: "revenusActivite",
    label: (individu) =>
      `${Individu.label(individu, "percevoir")} des revenus d'activité ?`,
  },
  {
    id: "rpns",
    label: (individu) =>
      `${Individu.label(
        individu,
        "percevoir"
      )} des revenus professionnels non salariés ?`,
  },
  {
    id: "allocations",
    label: (individu) =>
      `Quelle(s) allocation(s) ${Individu.label(individu, "percevoir")} déjà ?`,
  },
  {
    id: "indemnites",
    label: (individu) =>
      `${Individu.label(individu, "percevoir")} des indemnités ?`,
  },
  {
    id: "pensions",
    label: (individu) =>
      `${Individu.label(individu, "percevoir")} des pensions ?`,
  },
  {
    id: "patrimoine",
    label: (individu) =>
      `${Individu.label(individu, "percevoir")} des revenus du patrimoine ?`,
  },
  {
    id: "autre",
    label: (individu) =>
      `${Individu.label(individu, "percevoir")} d'autres revenus ?`,
  },
]

let ressourceTypes = [
  {
    id: "salaire_net",
    label: "Salaire (dont primes et indemnités de fin de contrat)",
    category: "revenusActivite",
    interuptionQuestionLabel:
      "un salaire, des allocations chômage, ou des indemnités de la sécurité sociale",
    positionInList: "1",
    hint: "Entrez le montant avant la retenue à la source",
  },
  {
    id: "indemnites_stage",
    label: "Rémunération de stage",
    category: "revenusActivite",
    prefix: "une",
  },
  {
    id: "revenus_stage_formation_pro",
    label: "Revenus de stage de formation professionnelle",
    category: "revenusActivite",
    prefix: "des",
  },
  {
    id: "chomage_net",
    label: "Allocations chômage (ARE)",
    category: "allocations",
    interuptionQuestionLabel:
      "des allocations chômage, un salaire ou des indemnités de la sécurité sociale",
    hint: "Entrez le montant avant la retenue à la source",
  },
  {
    id: "allocation_securisation_professionnelle",
    label: "Allocation de sécurisation professionnelle",
    category: "allocations",
    prefix: "une",
  },
  {
    id: "prime_forfaitaire_mensuelle_reprise_activite",
    label: "Prime forfaitaire mensuelle pour la reprise d’activité",
    category: "allocations",
    prefix: "une",
  },
  {
    id: "aide_logement",
    label: "Aides au logement (APL, ALS, ALF)",
    category: "allocations",
    prefix: "des",
  },
  {
    id: "af",
    label: "Allocations familiales",
    category: "allocations",
    prefix: "des",
    isRelevant: (situation, individu) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(situation.enfants && situation.enfants.length)
      )
    },
  },
  {
    id: "cf",
    label: "Complément familial (CF)",
    category: "allocations",
    prefix: "le",
    isRelevant: (situation, individu) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(situation.enfants && situation.enfants.length)
      )
    },
  },
  {
    id: "asf",
    label: "Allocation de soutien familial (ASF)",
    category: "allocations",
    prefix: "l’",
    isRelevant: (situation, individu) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(
          situation.enfants &&
            situation.enfants.filter((e) => e.garde_aternee).length
        )
      )
    },
  },
  {
    id: "rsa",
    label: "Revenu de solidarité active (RSA)",
    category: "allocations",
    prefix: "le",
  },
  {
    id: "ppa",
    label: "Prime d’activité",
    category: "revenusActivite",
    prefix: "la",
  },
  {
    id: "aspa",
    label: "Allocation de solidarité aux personnes âgées (ASPA)",
    category: "allocations",
    prefix: "l’",
    isRelevant: (situation, individu) => {
      return (
        55 <=
        Individu.age(
          individu,
          datesGenerator(situation.dateDeValeur).today.value
        )
      )
    },
  },
  {
    id: "asi",
    label: "Allocation supplémentaire d’invalidité (ASI)",
    category: "allocations",
    prefix: "l’",
    isRelevant: (situation, individu) => {
      return individu.handicap
    },
  },
  {
    id: "ass",
    label: "Allocation de solidarité spécifique (ASS)",
    category: "allocations",
    prefix: "l’",
    isRelevant: (situation, individu) => {
      return individu.activite != "etudiant"
    },
  },
  {
    id: "aah",
    label: "Allocation adulte handicapé (AAH)",
    category: "allocations",
    prefix: "l’",
    isRelevant: (situation, individu) => {
      return individu.handicap
    },
  },
  {
    id: "caah",
    label: "Complément de ressources adulte handicapé",
    category: "allocations",
    prefix: "le",
    sourceOpenfisca:
      "prestations.minima_sociaux.caah.montant_complement_ressources",
    isRelevant: (situation, individu) => {
      return individu.handicap
    },
  },
  {
    id: "garantie_jeunes",
    label: "Garantie jeunes",
    category: "allocations",
    prefix: "la",
    isRelevant: (situation, individu) => {
      const age = Individu.age(
        individu,
        datesGenerator(situation.dateDeValeur).today.value
      )
      return 16 <= age && age <= 25
    },
  },
  {
    id: "mva",
    label: "Majoration pour vie autonome (MVA)",
    category: "allocations",
    prefix: "la",
    sourceOpenfisca: "prestations.minima_sociaux.caah.majoration_vie_autonome",
    isRelevant: (situation, individu) => {
      return individu.handicap
    },
  },
  {
    id: "aeeh",
    label: "Allocation d’éducation de l’enfant handicapé (AEEH)",
    category: "allocations",
    prefix: "l’",
    isRelevant: (situation, individu) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(
          situation.enfants &&
            situation.enfants.filter((enfant) => enfant.handicap).length
        )
      )
    },
  },
  {
    id: "pch",
    label: "Prestation de compensation du handicap (PCH)",
    category: "allocations",
    prefix: "la",
    isRelevant: (situation, individu) => {
      return (
        individu.handicap ||
        Boolean(
          situation.enfants &&
            situation.enfants.filter((enfant) => enfant.handicap).length
        )
      )
    },
  },
  {
    id: "paje_base",
    label: "Prestation d’accueil du jeune enfant (PAJE) - Allocation de base",
    category: "allocations",
    prefix: "la",
    isRelevant: (situation, individu) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(situation.enfants && situation.enfants.length)
      )
    },
  },
  {
    id: "paje_clca",
    label: "Complément de libre choix d’activité (CLCA)",
    category: "allocations",
    prefix: "le",
    isRelevant: (situation, individu) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(situation.enfants && situation.enfants.length)
      )
    },
  },
  {
    id: "paje_prepare",
    label: "Prestation partagée d’éducation de l’enfant (PreParE)",
    category: "allocations",
    prefix: "la",
    isRelevant: (situation, individu) => {
      return (
        individu.id !== "demandeur" ||
        Boolean(situation.enfants && situation.enfants.length)
      )
    },
  },
  {
    id: "indemnites_journalieres_maternite",
    label: "Indemnités de maternité, paternité, adoption",
    category: "indemnites",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
    isRelevant: (situation) => situation.enfants && situation.enfants.length,
  },
  {
    id: "indemnites_journalieres_maladie",
    label: "Indemnités maladie",
    category: "indemnites",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
    hint: "Entrez le montant avant la retenue à la source",
  },
  {
    id: "indemnites_journalieres_maladie_professionnelle",
    label: "Indemnités maladie professionnelle",
    category: "indemnites",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
  },
  {
    id: "indemnites_journalieres_accident_travail",
    label: "Indemnités d’accident du travail",
    category: "indemnites",
    interuptionQuestionLabel:
      "des indemnités de la sécurité sociale, un salaire ou des allocations chômage",
  },
  {
    id: "indemnites_chomage_partiel",
    label: "Indemnités d’activité partielle",
    category: "indemnites",
    prefix: "des",
  },
  {
    id: "indemnites_volontariat",
    label: "Indemnités de volontariat",
    category: "indemnites",
    prefix: "des",
  },
  {
    id: "dedommagement_victime_amiante",
    label: "Dédommagement aux victimes de l’amiante",
    category: "indemnites",
    prefix: "un",
  },
  {
    id: "pensions_alimentaires_percues",
    label: "Pension alimentaire",
    category: "pensions",
    prefix: "une",
  },
  {
    id: "pensions_alimentaires_versees_individu",
    label: "Pension alimentaire versée",
    category: "pensions",
    interuptionQuestionLabel: "une pension alimentaire",
  },
  {
    id: "prestation_compensatoire",
    label: "Prestation compensatoire (suite à séparation)",
    category: "pensions",
    prefix: "une",
  },
  {
    id: "retraite_nette",
    label: "Retraite (y compris reversion), rente",
    category: "pensions",
    prefix: "une",
    hint: "Entrez le montant avant la retenue à la source",
    isRelevant(situation, individu) {
      return individu.activite === "retraite"
    },
  },
  {
    id: "retraite_combattant",
    label: "Retraite du combattant",
    category: "pensions",
    prefix: "une",
    isRelevant(situation, individu) {
      return individu.activite === "retraite"
    },
  },
  {
    id: "pensions_invalidite",
    label: "Pension d’invalidité",
    category: "pensions",
    prefix: "une",
  },
  {
    id: "bourse_enseignement_sup",
    label: "Bourse de l’enseignement supérieur",
    category: "autre",
    prefix: "une",
  },
  {
    id: "bourse_recherche",
    label: "Bourse de recherche",
    category: "autre",
    prefix: "une",
  },
  {
    id: "bourse_lycee",
    label: "Bourse du lycée",
    category: "autre",
    prefix: "une",
  },
  {
    id: "gains_exceptionnels",
    label: "Gains exceptionnels (dons, gains aux jeux, héritage)",
    category: "autre",
    prefix: "des",
  },
  {
    id: "revenus_locatifs",
    label: "Revenus locatifs (terrains, appartements, SCI…)",
    category: "patrimoine",
    prefix: "des",
  },
  {
    id: "revenus_capital",
    label: "Revenus du capital (intérêts, plus-values, dividendes…)",
    category: "patrimoine",
    prefix: "des",
  },
  {
    id: "rpns_micro_entreprise_CA_bic_vente_imp",
    label: "Via une micro-entreprise (Achat/revente ou fourniture de logement)",
    category: "rpns",
    isMontantAnnuel: true,
  },
  {
    id: "rpns_micro_entreprise_CA_bic_service_imp",
    label: "Via une micro-entreprise (Autre activité relevant des BIC)",
    category: "rpns",
    isMontantAnnuel: true,
  },
  {
    id: "rpns_micro_entreprise_CA_bnc_imp",
    label:
      "Via une micro-entreprise (Activité libérale et/ou intellectuelle (BNC))",
    category: "rpns",
    isMontantAnnuel: true,
  },
  {
    id: "rpns_auto_entrepreneur_CA_achat_revente",
    label:
      "En tant qu'auto-entrepreneur (Achat/revente ou fourniture de logement)",
    category: "rpns",
    interuptionQuestionLabel: "un chiffre d’affaires non nul",
  },
  {
    id: "rpns_auto_entrepreneur_CA_bic",
    label: "En tant qu'auto-entrepreneur (Autre activité relevant des BIC)",
    category: "rpns",
    interuptionQuestionLabel: "un chiffre d’affaires non nul",
  },
  {
    id: "rpns_auto_entrepreneur_CA_bnc",
    label:
      "En tant qu'auto-entrepreneur (Activité libérale et/ou intellectuelle (BNC))",
    category: "rpns",
    interuptionQuestionLabel: "un chiffre d’affaires non nul",
  },
  {
    id: "rpns_benefice_exploitant_agricole",
    label: "En tant qu'exploitant agricole",
    category: "rpns",
    isMontantAnnuel: true,
  },
  {
    id: "rpns_autres_revenus",
    label: "En profession libérale (entrepreneur)",
    category: "rpns",
    isMontantAnnuel: true,
    extra: [{ id: "tns_autres_revenus_type_activite", default: "bic" }],
  },
]

let categoriesRnc = [
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

let patrimoineTypes = [
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

module.exports = {
  ressourceCategories: ressourceCategories,
  ressourceTypes: ressourceTypes,
  categoriesRnc: categoriesRnc,
  patrimoineTypes: patrimoineTypes,
}
