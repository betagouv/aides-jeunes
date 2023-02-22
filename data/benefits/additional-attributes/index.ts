"use strict"

import dayjs from "dayjs"

import { benefitLayout } from "../../types/benefits.js"
import { openfiscaParametersLayout } from "../../../lib/types/parameters.js"
import { situationsLayout } from "../../../lib/types/situations.js"

import occitanie_carte_transport_scolaire_lio from "./occitanie-carte-transport-scolaire-lio.js"

export const additionalBenefitAttributes = {
  css_participation_forfaitaire: {
    extra: [
      {
        id: "cmu_c",
        entity: "familles",
        type: "bool",
        openfiscaPeriod: "thisMonth",
      },
    ],
    compute: function (result, period) {
      return result.cmu_c?.[period]
        ? true
        : result.css_participation_forfaitaire?.[period] || 0
    },
  },
  rsa: {
    labelFunction: function (b: benefitLayout) {
      return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`
    },
    customization: {
      D93: {
        link: "https://www.seine-saint-denis.fr/IMG/pdf/guide_rsa_a5_8p-2014.pdf",
      },
      D75: {
        form: undefined, // Prevent default form recycling
        teleservice:
          "https://www.paris.fr/rsa#ou-et-comment-faire-une-demande-de-rsa_6",
      },
      M200046977: {
        institution: {
          imgSrc: "img/logo_lyon_metropole.png",
        },
        link: "https://www.grandlyon.com/services/rsa-mode-d-emploi.html",
      },
    },
  },
  "cohesion-territoires-conseillers-numeriques-france-services": {
    instructionsGenerator: (codePostal) => {
      if (!codePostal) {
        return "https://cartographie.conseiller-numerique.gouv.fr/"
      } else {
        return `https://cartographie.conseiller-numerique.gouv.fr/?address=${codePostal}`
      }
    },
  },
  aide_logement: {
    computeUnexpectedAmount: (situation: situationsLayout) => {
      // not ideal because we are not computing other incomes => but covers 90% of the cases
      const salary: number = situation.demandeur?.salaire_net
        ? Object.values(situation.demandeur.salaire_net).reduce(
            (acc, value): number => acc + value,
            0
          )
        : 0
      return situation.demandeur?.activite === "etudiant" && salary >= 7000
    },
  },
  ppa: {
    labelFunction: function (b) {
      return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`
    },
    computeUnexpectedAmount(situation) {
      const menage = situation.menage
      const isProprietaire = ["primo_accedant", "proprietaire"].includes(
        menage.statut_occupation_logement
      )
      return (
        (isProprietaire && menage.loyer > 0) ||
        (menage.statut_occupation_logement === "loge_gratuitement" &&
          menage.participation_frais)
      )
    },
  },
  contrat_engagement_jeune: {
    computeUnexpectedAmount: (situation) => {
      const demandeur = situation.demandeur
      const period =
        situation.dateDeValeur && dayjs(situation.dateDeValeur).format("YYYY")

      return (
        situation.demandeur.habite_chez_parents &&
        demandeur.enfant_a_charge?.[period]
      )
    },
  },
  livret_epargne_populaire_taux: {
    labelFunction: function (b) {
      return `${b.label} avec un taux de ${b.montant}% / an ${b.legend}`
    },
    legend: (parameters: openfiscaParametersLayout) =>
      `au lieu de ${
        parameters["taxation_capital.epargne.livret_a.taux"] * 100
      }%`,
  },
  occitanie_carte_transport_scolaire_lio,
}
