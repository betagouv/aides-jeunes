const merge = require("lodash/merge")
const sortBy = require("lodash/sortBy")
const assign = require("lodash/assign")
const sumBy = require("lodash/sumBy")
const some = require("lodash/some")
const filter = require("lodash/filter")

const moment = require("moment")
const determineCustomizationIds = require("./Customization")
const { computeJavascriptBenefits } = require("./ComputeJavascript")
/**
 * OpenFisca test cases separate ressources between two entities: individuals and families.
 * In Mes Aides, we don't care about this separation and want to show eligibilty results for the demandeur only.
 * @param    {Object}  An Openfisca test case. <https://doc.openfisca.fr/openfisca-web-api/input-output-data.html#test-cases>
 * @return   {Object}  A new object containing the ressources of the family and of the individual. The family ressources will be overridden if conflicting.
 */
function normalizeOpenfiscaRessources(testCase) {
  const individuId = testCase.menages._.personne_de_reference[0]
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
  if (aide.type && aide.type === "mixed" && typeof amount === "boolean") {
    return amount
  }

  if (aide.type && aide.type === "bool") {
    return Boolean(amount)
  }

  const rounding = aide.floorAt || 1
  const value = Math.floor(amount / rounding) * rounding

  if (amount && !value) {
    return Math.floor(amount)
  } else {
    return value
  }
}

function computeAides(situation, id, openfiscaResponse, showPrivate) {
  const period = moment(situation.dateDeValeur).format("YYYY-MM")

  computeJavascriptBenefits(this, situation, openfiscaResponse)

  const customizationIds = determineCustomizationIds(openfiscaResponse, period)
  const computedRessources = normalizeOpenfiscaRessources(openfiscaResponse)

  const result = {
    droitsEligibles: [],
    droitsNonEligibles: [],
    droitsInjectes: [], // declared by the user
  }

  const individus = filter(
    [].concat(
      situation.demandeur,
      situation.conjoint,
      ...(situation.enfants || [])
    )
  )

  this.all
    .filter((benefit) => showPrivate || !benefit.private)
    .forEach((benefit) => {
      if (
        some(individus, function (individu) {
          return valueAt(benefit.id, individu, period) !== undefined
        }) ||
        valueAt(benefit.id, situation.famille, period) !== undefined
      ) {
        return result.droitsInjectes.push(
          assign({}, benefit, {
            montant: sumBy(individus, (i) =>
              Math.abs(valueAt(benefit.id, i, period))
            ),
          })
        )
      }

      let value = valueAt(
        benefit.id + "_non_calculable",
        computedRessources,
        period
      )

      if (!value || value === "calculable") {
        const source = benefit.openfisca_eligibility_source || benefit.id
        value = round(
          valueAt(source, computedRessources, period, benefit),
          benefit
        )
      }

      const dest = value ? result.droitsEligibles : result.droitsNonEligibles
      const customization =
        customizationIds &&
        benefit.customization &&
        ((customizationIds[1] && benefit.customization[customizationIds[1]]) ||
          (customizationIds[0] && benefit.customization[customizationIds[0]]))
      let institution =
        customization && customization.institution
          ? {
              ...benefit.institution,
              ...customization.institution,
            }
          : benefit.institution

      dest.push(
        assign({}, benefit, customization, {
          montant: value,
          showUnexpectedAmount:
            benefit.computeUnexpectedAmount &&
            benefit.computeUnexpectedAmount(situation),
          institution,
        })
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
exports.datesGenerator = require("../Dates").generator
