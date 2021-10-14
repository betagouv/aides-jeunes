const moment = require("moment")
const isNaN = require("lodash/isNaN")
const forEach = require("lodash/forEach")
const isUndefined = require("lodash/isUndefined")
const cloneDeep = require("lodash/cloneDeep")
const isString = require("lodash/isString")

const { formatDate } = require("../utils")
const individuRessource = require("./ressources")
const pastResourcesProxy = require("./pastResourcesProxy")
const { estActif } = require("../../../../../lib/Activite")

const {
  computeDistanceCommunes,
  findCommuneByInseeCode,
} = require("../../../mes-aides/distance")

const individuSchema = {
  activite: {
    src: "activite",
    fn: function (activite) {
      return estActif(activite) ? "actif" : activite
    },
  },
  apprenti: {
    src: "_contrat_alternant",
    fn: function (contratAlternant) {
      return contratAlternant === "apprenti"
    },
  },
  date_naissance: {
    src: "date_naissance",
    fn: formatDate,
  },
  age: {
    src: "date_naissance",
    fn: function (dateDeNaissance, individu, situation) {
      return (
        dateDeNaissance &&
        moment(situation.dateDeValeur).diff(moment(dateDeNaissance), "years")
      )
    },
  },
  age_en_mois: {
    src: "date_naissance",
    fn: function (dateDeNaissance, individu, situation) {
      return (
        dateDeNaissance &&
        moment(situation.dateDeValeur).diff(moment(dateDeNaissance), "months")
      )
    },
  },
  bourse_criteres_sociaux_distance_domicile_familial: {
    fn: function (individu, situation) {
      if (individu.habite_chez_parents) {
        return 0
      }

      if (situation.parents && !situation.parents._en_france) {
        return 260
      }

      var jeuneCommune = findCommuneByInseeCode(situation.menage.depcom)
      var parentCommune = findCommuneByInseeCode(
        individu._bourseCriteresSociauxCommuneDomicileFamilial
      )
      return computeDistanceCommunes(jeuneCommune, parentCommune)
    },
  },
  contrat_de_travail_debut: {
    src: "_nombreMoisDebutContratDeTravail",
    fn: function (_nombreMoisDebutContratDeTravail, _, situation) {
      return moment(situation.dateDeValeur)
        .subtract(_nombreMoisDebutContratDeTravail, "months")
        .format("YYYY-MM-DD")
    },
  },
  date_arret_de_travail: {
    src: "date_arret_de_travail",
    fn: formatDate,
  },
  date_debut_chomage: {
    src: "date_debut_chomage",
    fn: formatDate,
  },
  debut_etudes_etranger: {
    fn: function (_, situation) {
      return moment(situation.dateDeValeur).format("YYYY-MM-DD")
    },
  },
  fin_etudes_etranger: {
    src: "_dureeMoisEtudesEtranger",
    fn: function (_dureeMoisEtudesEtranger, _, situation) {
      return moment(situation.dateDeValeur)
        .add(_dureeMoisEtudesEtranger, "M")
        .add(1, "d")
        .format("YYYY-MM-DD")
    },
  },
  mobili_jeune_eligibilite_employeur: {
    fn: function () {
      return true
    },
  },
  niveau_diplome_formation: {
    fn: function (individu) {
      if (individu._continuite_etudes) {
        return "niveau_5"
      } else {
        return "non_renseigne"
      }
    },
  },
  plus_haut_diplome_date_obtention: {
    src: "plus_haut_diplome_date_obtention",
    fn: formatDate,
  },
  professionnalisation: {
    src: "_contrat_alternant",
    fn: function (contratAlternant) {
      return contratAlternant === "professionnalisation"
    },
  },
  regime_securite_sociale: {
    src: "regime_securite_sociale",
    fn: function (regime_securite_sociale) {
      return regime_securite_sociale !== "inconnu"
        ? regime_securite_sociale
        : "regime_general"
    },
  },
}

function isNotValidValue(value) {
  return (
    isNaN(value) ||
    isUndefined(value) ||
    value === null ||
    value === "Invalid date"
  )
}

function buildOpenFiscaIndividu(mesAidesIndividu, situation) {
  var openFiscaIndividu = cloneDeep(mesAidesIndividu)
  forEach(individuSchema, function (definition, openfiscaKey) {
    var params = isString(definition) ? { src: definition } : definition

    openFiscaIndividu[openfiscaKey] = params.src
      ? params.fn(mesAidesIndividu[params.src], mesAidesIndividu, situation)
      : params.fn(mesAidesIndividu, situation)

    // Remove null as OpenFisca do not handle them correctly
    if (isNotValidValue(openFiscaIndividu[openfiscaKey])) {
      delete openFiscaIndividu[openfiscaKey]
    }
  })

  individuRessource.computeRessources(mesAidesIndividu, openFiscaIndividu)
  pastResourcesProxy(openFiscaIndividu, situation)
  return openFiscaIndividu
}

buildOpenFiscaIndividu.additionalProps = individuSchema
module.exports = buildOpenFiscaIndividu
