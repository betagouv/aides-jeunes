var filter = require("lodash/filter")
var forEach = require("lodash/forEach")
var assign = require("lodash/assign")
var pickBy = require("lodash/pickBy")
var difference = require("lodash/difference")
var cloneDeep = require("lodash/cloneDeep")

var common = require("./common")
var buildOpenFiscaIndividu = require("./individu")
var migrations = require("../../migrations")

var propertyMove = require("./propertyMove")
var last3MonthsDuplication = require("./last3MonthsDuplication")

function allocateIndividualsToEntities(situation) {
  var famille = situation.famille
  var foyer = situation.foyer_fiscal
  var menage = situation.menage

  var demandeur = common.getDemandeur(situation)
  var demandeurId = demandeur && demandeur.id

  famille.parents = [demandeurId]
  menage.personne_de_reference = [demandeurId]

  const aCharge =
    demandeur.enfant_a_charge &&
    Object.keys(demandeur.enfant_a_charge).length &&
    demandeur.enfant_a_charge[Object.keys(demandeur.enfant_a_charge)]
  foyer.declarants = []
  foyer.personnes_a_charge = []

  if (aCharge) {
    foyer.personnes_a_charge.push(demandeurId)
  } else {
    foyer.declarants.push(demandeurId)
  }

  var conjoint = common.getConjoint(situation)
  var conjointId = conjoint && conjoint.id
  if (conjointId) {
    famille.parents.push(conjointId)
    menage.conjoint = [conjointId]

    if (aCharge) {
      foyer.personnes_a_charge.push(conjointId)
    } else {
      foyer.declarants.push(conjointId)
    }
  }

  var enfants = common.getEnfants(situation)
  var validEnfants = filter(enfants, function (enfant) {
    return common.isIndividuValid(enfant, situation)
  })
  var enfantIds = validEnfants.map(function (enfant) {
    return enfant.id
  })
  famille.enfants = enfantIds
  foyer.personnes_a_charge = []
    .concat(...foyer.personnes_a_charge)
    .concat(...enfantIds)
  menage.enfants = enfantIds
}

function setNonInjectedPrestations(testCase, periods, value) {
  var prestationsFinancieres = pickBy(
    common.requestedVariables,
    function (definition) {
      return !definition.type || definition.type === "float"
    }
  )

  forEach(prestationsFinancieres, function (definition, prestationName) {
    forEach(testCase[definition.entity], function (entity) {
      entity[prestationName] = entity[prestationName] || {}
      forEach(periods, function (period) {
        if (value === undefined) {
          delete entity[prestationName][period]
        } else {
          entity[prestationName][period] =
            entity[prestationName][period] || value
        }
      })
    })
  })
}
exports.setNonInjectedPrestations = setNonInjectedPrestations

function mapIndividus(situation) {
  var individus = filter(
    common.getIndividusSortedParentsFirst(situation),
    function (individu) {
      return common.isIndividuValid(individu, situation)
    }
  )
  return individus
    .map(function (individu) {
      return buildOpenFiscaIndividu(individu, situation)
    })
    .reduce(function (accum, individu) {
      accum[individu.id] = individu
      delete individu.id
      return accum
    }, {})
}

function giveValueToRequestedVariables(testCase, periods, value, demandeur) {
  var prestationsWithInterest = pickBy(
    common.requestedVariables,
    function (definition, prestationName) {
      return (
        (!definition.interestFlag || demandeur[definition.interestFlag])
      )
    }
  )

  if (!(periods instanceof Array)) {
    periods = [periods]
  }

  forEach(prestationsWithInterest, function (definition, prestationName) {
    forEach(testCase[definition.entity], function (entity) {
      entity[prestationName] = entity[prestationName] || {}
      forEach(periods, function (period) {
        if (
          typeof entity[prestationName][period] !== "undefined" &&
          entity[prestationName][period] !== null
        ) {
          return
        }
        if (value === undefined) {
          delete entity[prestationName][period]
        } else {
          entity[prestationName][period] = value
        }
      })
    })
  })
}
exports.giveValueToRequestedVariables = giveValueToRequestedVariables
exports.allocateIndividualsToEntities = allocateIndividualsToEntities

// Use heuristics to pass functional tests
// Complexity may be added in the future in the application (new questions to ask)
// So far, due to a bug or some ambiguity
// cf. https://github.com/openfisca/openfisca-france/pull/1233
// logement_conventionne needs to be true when the loan in fully paid
// to avoid a benefit from appearing
function applyHeuristicsAndFix(testCase, dateDeValeur) {
  var thisMonth = common.getPeriods(dateDeValeur).thisMonth

  var menage = assign(
    {},
    {
      logement_conventionne: {},
    },
    testCase.menages._
  )
  menage.logement_conventionne[thisMonth] =
    menage.statut_occupation_logement &&
    menage.statut_occupation_logement[thisMonth] == "primo_accedant" &&
    menage.loyer &&
    menage.loyer[thisMonth] == 0

  testCase.menages._ = menage
  return testCase
}

exports.buildOpenFiscaRequest = function (sourceSituation) {
  var situation = sourceSituation.toObject
    ? migrations.apply(sourceSituation).toObject()
    : cloneDeep(sourceSituation)

  var individus = mapIndividus(situation)
  allocateIndividualsToEntities(situation)

  var testCase = {
    individus: individus,
    familles: {
      _: situation.famille,
    },
    foyers_fiscaux: {
      _: situation.foyer_fiscal,
    },
    menages: {
      _: situation.menage,
    },
  }

  // Variables stored to properly restore UI should not be sent to OpenFisca
  forEach(testCase, (items) => {
    forEach(items, (item) => {
      const propsToDelete = Object.keys(item).filter((i) => i.startsWith("_"))
      propsToDelete.forEach(function (propertyName) {
        delete item[propertyName]
      })
    })
  })

  propertyMove.movePropertyValuesToGroupEntity(testCase)

  var periods = common.getPeriods(situation.dateDeValeur)
  setNonInjectedPrestations(
    testCase,
    difference(periods.last12Months, periods.last3Months),
    0
  )
  last3MonthsDuplication(testCase, situation.dateDeValeur)
  giveValueToRequestedVariables(
    testCase,
    periods.thisMonth,
    null,
    situation.demandeur
  )

  return applyHeuristicsAndFix(testCase, sourceSituation.dateDeValeur)
}
