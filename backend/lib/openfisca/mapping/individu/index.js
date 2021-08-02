var moment = require("moment")
var isNaN = require("lodash/isNaN")
var forEach = require("lodash/forEach")
var isUndefined = require("lodash/isUndefined")
var cloneDeep = require("lodash/cloneDeep")
var isString = require("lodash/isString")

var individuRessource = require("./ressources")
var pastResourcesProxy = require("./pastResourcesProxy")
const {
  computeDistanceCommunes,
  findCommuneByInseeCode,
} = require("../../../mes-aides/distance")

function formatDate(date) {
  return date && moment(date).format("YYYY-MM-DD")
}

var individuSchema = {
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
