"use strict"

const moment = require("moment")

const additionalBenefitAttributes = {
  css_participation_forfaitaire: {
    extra: [{ id: "cmu_c", entity: "familles", type: "bool" }],
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
    uncomputability: {
      tns: {
        reason: {
          user: "vous avez des revenus en tant qu’indépendant·e",
          admin: "le demandeur a des revenus en tant qu’indépendant·e",
        },
        solution:
          'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont vos revenus non salariés impacteront le montant de votre aide.',
      },
      conjoint_tns: {
        reason: {
          user: "votre conjoint·e a des revenus en tant qu’indépendant·e",
          admin:
            "le conjoint du demandeur a des revenus en tant qu’indépendant·e",
        },
        solution:
          'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont les revenus non salariés de votre conjoint·e impacteront le montant de votre aide.',
      },
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
          imgSrc: "logo_lyon_metropole.png",
        },
        link: "https://www.grandlyon.com/services/rsa-mode-d-emploi.html",
      },
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
    uncomputability: {
      primo_accedant: {
        reason: {
          user: 'vous êtes <abbr title="Non propriétaire de votre résidence principale dans les deux années précédant l’achat de votre résidence actuelle">primo-accédant</abbr> à la propriété de votre résidence principale',
          admin: "le demandeur est primo-accédant de sa résidence principale",
        },
        solution:
          'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> pourra estimer vos droits sur la base de la valeur de votre bien.',
      },
      locataire_foyer: {
        reason: {
          user: "vous logez dans un foyer",
          admin: "le demandeur loge dans un foyer",
        },
        solution:
          'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> vous donnera des estimations selon les différentes conventions possibles de votre foyer.',
      },
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
  apa_eligibilite: require("./apa-eligibilite"),
  livret_epargne_populaire_taux: {
    labelFunction: function (b) {
      return `${b.label} avec un taux de ${b.montant}% an ${b.legend}`
    },
    legend: (parameters) =>
      `au lieu de ${parameters["epargne.livret_a.taux"] * 100}%`,
  },
  fsl_eligibilite: require("./fsl-eligibilite"),
  occitanie_carte_transport_scolaire_lio: require("./occitanie-carte-transport-scolaire-lio"),
}

module.exports = additionalBenefitAttributes
