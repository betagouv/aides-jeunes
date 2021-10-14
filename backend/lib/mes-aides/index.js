const merge = require("lodash/merge")
const sortBy = require("lodash/sortBy")
const assign = require("lodash/assign")
const sumBy = require("lodash/sumBy")
const some = require("lodash/some")
const filter = require("lodash/filter")

const moment = require("moment")
const determineCustomizationIds = require("./customization")
const { computeFrontEndBenefits } = require("./computeFrontEndBenefits")
/**
 * OpenFisca test cases separate ressources between two entities: individuals and families.
 * In Mes Aides, we don't care about this separation and want to show eligibilty results for the demandeur only.
 * @param    {Object}  An Openfisca test case. <https://doc.openfisca.fr/openfisca-web-api/input-output-data.html#test-cases>
 * @return   {Object}  A new object containing the ressources of the family and of the individual. The family ressources will be overridden if conflicting.
 */
function normalizeOpenfiscaRessources(testCase) {
  var individuId = testCase.menages._.personne_de_reference[0]
  return merge(
    {},
    testCase.foyers_fiscaux._,
    testCase.menages._,
    testCase.familles._,
    testCase.individus.demandeur || testCase.individus[individuId]
  )
}

function valueAt(ressourceId, ressources, period, aide) {
  if (aide && aide.compute) {
    return aide.compute(ressources, period)
  } else {
    return (
      (typeof ressources[ressourceId] !== "object" &&
        ressources[ressourceId]) ||
      (ressources[ressourceId] && ressources[ressourceId][period])
    )
  }
}

function round(amount, aide) {
  if (aide.type && aide.type === "complex" && typeof amount === "boolean") {
    return amount
  }

  if (aide.type && aide.type === "bool") {
    return Boolean(amount)
  }

  var rounding = aide.floorAt || 1
  var value = Math.floor(amount / rounding) * rounding

  if (amount && !value) {
    return Math.floor(amount)
  } else {
    return value
  }
}

function computeAides(situation, id, openfiscaResponse, showPrivate) {
  var period = moment(situation.dateDeValeur).format("YYYY-MM")

  computeFrontEndBenefits(this, situation, openfiscaResponse)

  var customizationIds = determineCustomizationIds(openfiscaResponse, period)
  var computedRessources = normalizeOpenfiscaRessources(openfiscaResponse)

  var result = {
    droitsEligibles: [],
    droitsNonEligibles: [],
    droitsInjectes: [], // declared by the user
  }

  var individus = filter(
    [].concat(
      situation.demandeur,
      situation.conjoint,
      ...(situation.enfants || [])
    )
  )

  this.forEach((aide, aideId, aidesProvider, aidesProviderId) => {
    if (!showPrivate && aide.private) {
      return
    }

    if (
      some(individus, function (individu) {
        return valueAt(aideId, individu, period) !== undefined
      }) ||
      valueAt(aideId, situation.famille, period) !== undefined
    ) {
      return result.droitsInjectes.push(
        assign({}, aide, {
          id: aideId,
          montant: sumBy(individus, (i) =>
            Math.abs(valueAt(aideId, i, period))
          ),
        })
      )
    }

    var value = valueAt(aideId + "_non_calculable", computedRessources, period)

    if (!value || value === "calculable") {
      const source = aide.openfisca_eligibility_source || aideId
      value = round(valueAt(source, computedRessources, period, aide), aide)
    }

    var dest = value ? result.droitsEligibles : result.droitsNonEligibles
    dest.push(
      assign(
        {},
        aide,
        {
          id: aideId,
          montant: value,
          provider: aidesProvider,
          providerId: aidesProviderId,
          showUnexpectedAmount:
            aide.computeUnexpectedAmount &&
            aide.computeUnexpectedAmount(situation),
        },
        customizationIds &&
          aide.customization &&
          ((customizationIds[1] && aide.customization[customizationIds[1]]) ||
            (customizationIds[0] && aide.customization[customizationIds[0]]))
      )
    )
  })

  Object.keys(result).forEach(function (group) {
    result[group] = sortBy(result[group], ["top", "label"])
  })

  result._id = id
  return result
}

exports.computeAides = computeAides
exports.round = round
exports.datesGenerator = require("./dates").generator
