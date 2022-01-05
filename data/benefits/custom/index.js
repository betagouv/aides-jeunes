"use strict"

const moment = require("moment")

const additionnalBenefitsAttributes = {
  css_participation_forfaitaire: {
    compute: function (result, period) {
      return result.cmu_c?.[period]
        ? true
        : result.css_participation_forfaitaire?.[period] || 0
    },
  },
  rsa: {
    labelFunction: function (b) {
      return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`
    },
  },
  aide_logement: {
    computeUnexpectedAmount: (situation) => {
      // not ideal because we are not computing other incomes => but covers 90% of the cases
      const salary = situation.demandeur.salaire_net
        ? Object.values(situation.demandeur.salaire_net).reduce(
            (acc, value) => acc + value,
            0
          )
        : 0
      return situation.demandeur.activite === "etudiant" && salary >= 7000
    },
  },
  ppa: {
    labelFunction: function (b) {
      return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`
    },
    computeUnexpectedAmount(situation) {
      let menage = situation.menage
      let isProprietaire = ["primo_accedant", "proprietaire"].includes(
        menage.statut_occupation_logement
      )
      return (
        (isProprietaire && menage.loyer > 0) ||
        (menage.statut_occupation_logement === "loge_gratuitement" &&
          menage.participation_frais)
      )
    },
  },
  garantie_jeunes: {
    computeUnexpectedAmount: (situation) => {
      let demandeur = situation.demandeur
      let period =
        situation.dateDeValeur && moment(situation.dateDeValeur).format("YYYY")

      return (
        situation.demandeur.habite_chez_parents &&
        demandeur.enfant_a_charge?.[period]
      )
    },
  },
  livret_epargne_populaire_taux: {
    labelFunction: function (b) {
      return `${b.label} avec un taux de ${b.montant}% an ${b.legend}`
    },
    legend: (parameters) =>
      `au lieu de ${parameters["epargne.livret_a.taux"] * 100}%`,
  },
  fsl_eligibilite: require("./fsl_eligibilite"),
}

module.exports = additionnalBenefitsAttributes
