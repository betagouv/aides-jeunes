import { merge, sortBy, assign, sumBy, some, filter } from "lodash-es"

import determineCustomizationIds from "./customization.js"
import { computeJavascriptBenefits } from "./compute-javascript.js"
import { computeAidesVeloBenefits } from "./compute-aides-velo.js"

import { generator } from "../dates.js"
export const datesGenerator = generator

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

function valueAt(ressourceId, ressources, period, aide?: any) {
  if (aide?.compute) {
    return aide.compute(ressources, period)
  } else {
    return (
      (typeof ressources[ressourceId] !== "object" &&
        ressources[ressourceId]) ||
      ressources[ressourceId]?.[period]
    )
  }
}

export function round(amount, aide) {
  if (aide.type === "mixed" && typeof amount === "boolean") {
    return amount
  }

  if (aide.type === "bool") {
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

function keepClosestFSL(benefits, openfiscaResponse, periods) {
  const fslBenefits = Object.keys(openfiscaResponse.individus.demandeur).filter(
    (key) => {
      return (
        key.includes("fsl-eligibilite") &&
        openfiscaResponse.individus.demandeur[key][periods.thisMonth.id]
      )
    }
  )
  if (fslBenefits.length >= 2) {
    const epciFsl =
      fslBenefits.find((key) => benefits[key].institution.type === "epci") ||
      fslBenefits[0]
    fslBenefits
      .filter((key) => key !== epciFsl)
      .forEach((key) => {
        delete openfiscaResponse.individus.demandeur[key]
      })
  }
}

export function computeAides(situation, id, openfiscaResponse, showPrivate) {
  const periods = generator(situation.dateDeValeur)

  computeJavascriptBenefits(this, situation, openfiscaResponse)
  keepClosestFSL(this.benefitsMap, openfiscaResponse, periods)

  const customizationIds = determineCustomizationIds(situation)
  const computedRessources = normalizeOpenfiscaRessources(openfiscaResponse)

  const result = {
    droitsEligibles: [],
    droitsInjectes: [], // declared by the user
    _id: undefined,
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
      // Only Openfisca benefit has openfiscaPeriod
      const period = benefit.openfiscaPeriod
        ? periods[benefit.openfiscaPeriod].id
        : periods.thisMonth.id

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
        `${benefit.id}_non_calculable`,
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

      if (!value) {
        return
      }
      const customization =
        benefit.customization?.[customizationIds?.[1]] ||
        benefit.customization?.[customizationIds?.[0]]
      const institution = customization?.institution
        ? {
            ...benefit.institution,
            ...customization.institution,
          }
        : benefit.institution

      result.droitsEligibles.push(
        assign({}, benefit, customization, {
          instructions:
            benefit.instructions ||
            benefit.instructionsGenerator(situation.menage._codePostal),
          montant: value,
          showUnexpectedAmount: benefit.computeUnexpectedAmount?.(situation),
          institution,
        })
      )
    })

  if (situation.demandeur._interetsAidesVelo?.length) {
    const aidesVeloList = this.all.filter((b) => b.source === "aides-velo")
    computeAidesVeloBenefits(
      aidesVeloList,
      result.droitsEligibles,
      situation,
      openfiscaResponse
    )
  }

  Object.keys(result).forEach(function (group) {
    result[group] = sortBy(result[group], ["top", "label"])
  })

  result._id = id
  return result
}
