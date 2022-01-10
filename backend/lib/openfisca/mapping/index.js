const filter = require("lodash/filter")
const forEach = require("lodash/forEach")
const assign = require("lodash/assign")
const pickBy = require("lodash/pickBy")
const difference = require("lodash/difference")
const cloneDeep = require("lodash/cloneDeep")

const common = require("./common")
const buildOpenFiscaIndividu = require("./individu")
const buildOpenFiscaMenage = require("./menage")
const migrations = require("../../migrations")

const propertyMove = require("./property-move")
const last3MonthsDuplication = require("./last3-months-duplication")
const {
  filterByInterestFlag,
} = require("../../../../lib/benefits/filter-interest-flag")

function dispatchIndividuals(situation) {
  const individus = mapIndividus(situation)

  const familles = { _: situation.famille }
  const foyers_fiscaux = {
    _: {
      declarants: [],
      personnes_a_charge: [],
    },
  }
  const menages = { _: buildOpenFiscaMenage(situation) }

  const demandeur = common.getDemandeur(situation)
  const demandeurId = demandeur?.id

  familles._.parents = [demandeurId]
  menages._.personne_de_reference = [demandeurId]

  const aCharge =
    demandeur.enfant_a_charge &&
    Object.keys(demandeur.enfant_a_charge).length &&
    demandeur.enfant_a_charge[Object.keys(demandeur.enfant_a_charge)]

  if (aCharge) {
    const parent1 = {
      id: "parent1",
    }
    individus[parent1.id] = { ...parent1, id: undefined }
    familles.parents = { parents: [parent1.id], enfants: [] }
    foyers_fiscaux._.declarants.push(parent1.id)
    menages.parents = {
      personne_de_reference: [parent1.id],
      enfants: [],
    }

    if (situation.parents?._situation == "en_couple") {
      const parent2 = {
        id: "parent2",
      }
      individus[parent2.id] = { ...parent2, id: undefined }
      familles.parents.parents.push(parent2.id)
      foyers_fiscaux._.declarants.push(parent2.id)
      menages.parents.conjoint = [parent2.id]
    }

    foyers_fiscaux._.personnes_a_charge.push(demandeurId)
  } else {
    foyers_fiscaux._.declarants.push(demandeurId)
  }

  const conjoint = common.getConjoint(situation)
  const conjointId = conjoint?.id
  if (conjointId) {
    familles._.parents.push(conjointId)
    menages._.conjoint = [conjointId]

    if (aCharge) {
      foyers_fiscaux[conjointId] = {
        declarants: [conjointId],
      }
    } else {
      foyers_fiscaux._.declarants.push(conjointId)
    }
  }

  const enfants = common.getEnfants(situation)
  const validEnfants = filter(enfants, function (enfant) {
    return common.isIndividuValid(enfant, situation)
  })
  const enfantIds = validEnfants.map(function (enfant) {
    return enfant.id
  })
  familles._.enfants = enfantIds
  foyers_fiscaux._.personnes_a_charge = []
    .concat(...foyers_fiscaux._.personnes_a_charge)
    .concat(...enfantIds)
  menages._.enfants = enfantIds

  return {
    individus: individus,
    familles,
    foyers_fiscaux,
    menages,
  }
}

function setNonInjected(testCase, prestations, periods, value) {
  forEach(prestations, function (definition, prestationName) {
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

function mapIndividus(situation) {
  const individus = filter(
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

function giveValueToRequestedVariables(testCase, prestations, periods, value) {
  if (!(periods instanceof Array)) {
    periods = [periods]
  }

  forEach(prestations, function (definition, prestationName) {
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
exports.dispatchIndividuals = dispatchIndividuals

// Use heuristics to pass functional tests
// Complexity may be added in the future in the application (new questions to ask)
// So far, due to a bug or some ambiguity
// cf. https://github.com/openfisca/openfisca-france/pull/1233
// logement_conventionne needs to be true when the loan in fully paid
// to avoid a benefit from appearing
function applyHeuristicsAndFix(testCase, sourceSituation) {
  const periods = common.getPeriods(sourceSituation.dateDeValeur)

  const menage = assign(
    {},
    {
      logement_conventionne: {},
    },
    testCase.menages._
  )
  menage.logement_conventionne[periods.thisMonth] =
    menage.statut_occupation_logement?.[periods.thisMonth] ==
      "primo_accedant" && menage.loyer?.[periods.thisMonth] == 0

  const demandeur = sourceSituation.demandeur
  const parents = sourceSituation.parents

  const aCharge = demandeur.enfant_a_charge?.[periods.thisYear]

  if (aCharge) {
    if (demandeur.bourse_criteres_sociaux_base_ressources_parentale) {
      testCase.foyers_fiscaux._.rbg = {
        [periods.fiscalYear]:
          demandeur.bourse_criteres_sociaux_base_ressources_parentale,
      }
    }
    if (parents.rfr) {
      testCase.foyers_fiscaux._.rfr = {
        [periods.fiscalYear]: parents.rfr,
      }
    }
    if (parents.nbptr) {
      testCase.foyers_fiscaux._.nbptr = {
        [periods.fiscalYear]: parents.nbptr,
      }
    }
  }

  testCase.menages._ = menage
  return testCase
}
exports.applyHeuristicsAndFix = applyHeuristicsAndFix

exports.buildOpenFiscaRequest = function (sourceSituation) {
  const situation = sourceSituation.toObject
    ? migrations.apply(sourceSituation).toObject()
    : cloneDeep(sourceSituation)

  const testCase = dispatchIndividuals(situation)

  // Variables stored to properly restore UI should not be sent to OpenFisca
  forEach(testCase, (items) => {
    forEach(items, (item) => {
      const propsToDelete = Object.keys(item).filter((i) => i.startsWith("_"))
      propsToDelete.forEach(function (propertyName) {
        delete item[propertyName]
      })
    })
  })

  // Move properties to its group (familles, foyers_fiscaux) define in definition.js
  propertyMove.movePropertyValuesToGroupEntity(testCase)

  const periods = common.getPeriods(situation.dateDeValeur)

  const prestationsFinancieres = pickBy(
    common.requestedVariables,
    function (definition) {
      return (
        (!definition.type || definition.type === "float") &&
        !definition.openfiscaPeriod
      )
    }
  )

  setNonInjected(
    testCase,
    prestationsFinancieres,
    difference(periods.last12Months, periods.last3Months),
    0
  )

  const prestationsFinancieresAtZeroRecently = pickBy(
    common.requestedVariables,
    function (definition) {
      return (
        (!definition.type || definition.type === "float") &&
        definition.setToZeroRecently &&
        !definition.openfiscaPeriod
      )
    }
  )

  setNonInjected(
    testCase,
    prestationsFinancieresAtZeroRecently,
    periods.last3Months,
    0
  )
  last3MonthsDuplication(testCase, situation.dateDeValeur)

  const prestationsWithInterest = pickBy(
    common.requestedVariables,
    function (definition) {
      return filterByInterestFlag(definition, situation.demandeur)
    }
  )

  const openfiscaPeriods = new Set()
  Object.values(prestationsWithInterest).forEach((definition) => {
    openfiscaPeriods.add(definition.openfiscaPeriod)
  })

  openfiscaPeriods.forEach((value) => {
    const prestations = pickBy(prestationsWithInterest, function (definition) {
      return definition.openfiscaPeriod === value
    })

    giveValueToRequestedVariables(
      testCase,
      prestations,
      value ? periods[value] : periods.thisMonth,
      null
    )
  })

  return applyHeuristicsAndFix(testCase, sourceSituation)
}
