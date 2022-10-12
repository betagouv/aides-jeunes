import resources from "./resources"
import { filter, keys, keyBy, uniq } from "lodash"

import { datesGeneratorLayout, dateLayout } from "../lib/types/dates"
import { resourceLayout } from "./types/resources"

function getPeriodsForCurrentYear(dates: datesGeneratorLayout, ressourceType) {
  const periodKeys: dateLayout[] = []
  if (ressourceType.isMontantAnnuel) {
    periodKeys.push(dates.lastYear)
    return periodKeys
  }
  dates.last12Months.forEach((m) => periodKeys.push(m))

  if (!ressourceType.revenuExceptionnel) {
    periodKeys.unshift(dates.thisMonth)
  }

  return periodKeys
}

function getPeriodKeysForCurrentYear(
  dates: datesGeneratorLayout,
  ressourceType
) {
  return getPeriodsForCurrentYear(dates, ressourceType).map((date) => date.id)
}

function setDefaultValueForCurrentYear(
  dates: datesGeneratorLayout,
  individu,
  ressourceType
) {
  const ressourceId = ressourceType.id
  individu[ressourceId] = individu[ressourceId] || {}
  const ressource = individu[ressourceId]
  const periodKeys = getPeriodKeysForCurrentYear(dates, ressourceType)

  if (
    periodKeys.some(function (periodKey) {
      return typeof ressource[periodKey] === "number"
    })
  ) {
    return
  }

  if (ressourceType.extra) {
    ressourceType.extra.forEach((e) => {
      individu[e.id] = individu[e.id] || e.default
    })
  }

  periodKeys.forEach(function (periodKey) {
    ressource[periodKey] = ressource[periodKey] || null
  })
}

function unsetForCurrentYear(
  dates: datesGeneratorLayout,
  entity,
  ressourceType
) {
  const ressourceId = ressourceType.id
  entity[ressourceId] = entity[ressourceId] || {}
  const ressource = entity[ressourceId]
  const periodKeys = getPeriodKeysForCurrentYear(dates, ressourceType)
  periodKeys.forEach(function (periodKey) {
    delete ressource[periodKey]
  })

  if (ressourceType.extra) {
    ressourceType.extra.forEach((e) => {
      delete entity[e.id]
    })
  }

  if (!ressource || Object.keys(ressource).length === 0) {
    delete entity[ressourceId]
  }
}

function isRessourceRelevant(ressourceType, situation, individu): boolean {
  return (
    !ressourceType.isRelevant || ressourceType.isRelevant(situation, individu)
  )
}

const ressourcesForTrailingMonthsAndFiscalYear = resources.categoriesRnc
  .filter(function (fiscalRessource) {
    return (
      fiscalRessource?.sources &&
      fiscalRessource.sources.indexOf(fiscalRessource.id) >= 0
    )
  })
  .map(function (fiscalRessource) {
    return fiscalRessource.id
  })

function isSelectedForCurrentYear(ressource, ressourceIdOrType) {
  // A single value means that a SINGLE value has been specified for the FISCAL year
  // Multiple values means that current year values were specified
  if (
    ressourcesForTrailingMonthsAndFiscalYear.indexOf(
      ressourceIdOrType.id || ressourceIdOrType
    ) >= 0
  ) {
    return keys(ressource).length > 1
  }

  return Boolean(ressource)
}

function getIndividuRessourceCategories(individu, situation) {
  return uniq(
    filter(
      resources.ressourceTypes,
      (ressourceType: resourceLayout) =>
        isSelectedForCurrentYear(individu[ressourceType.id], ressourceType) &&
        isRessourceOnMainScreen(ressourceType) &&
        isRessourceRelevant(ressourceType, situation, individu)
    ).map((r) => r.category)
  )
}

function getIndividuRessourceTypes(individu, situation) {
  return filter(resources.ressourceTypes, (ressourceType) => {
    return (
      isRessourceOnMainScreen(ressourceType) &&
      isRessourceRelevant(ressourceType, situation, individu)
    )
  }).reduce((accumulator, ressourceType) => {
    accumulator[ressourceType.id] = isSelectedForCurrentYear(
      individu[ressourceType.id],
      ressourceType
    )
    return accumulator
  }, {})
}

function getIndividuRessourceTypesByCategory(individu, category, situation) {
  return filter(resources.ressourceTypes, (ressourceType) => {
    return (
      ressourceType.category === category &&
      isRessourceOnMainScreen(ressourceType) &&
      isRessourceRelevant(ressourceType, situation, individu)
    )
  }).reduce((accumulator, ressourceType) => {
    accumulator[ressourceType.id] = isSelectedForCurrentYear(
      individu[ressourceType.id],
      ressourceType
    )
    return accumulator
  }, {})
}

function setIndividuRessourceTypes(individu, types, dates) {
  const typeMap = keyBy(
    filter(resources.ressourceTypes, isRessourceOnMainScreen),
    "id"
  )

  Object.keys(types).forEach(function (ressourceTypeId) {
    if (types[ressourceTypeId]) {
      setDefaultValueForCurrentYear(dates, individu, typeMap[ressourceTypeId])
    } else {
      unsetForCurrentYear(dates, individu, typeMap[ressourceTypeId])
    }
  })
}

function isRessourceOnMainScreen(ressourceOrType): boolean {
  // Make this function robust so that it can be called with a type from the ressourceTypes constant, or just a string.
  const type = ressourceOrType.id || ressourceOrType
  return type != "pensions_alimentaires_versees_individu"
}

export default {
  getPeriodsForCurrentYear,
  // Ne semble pas être utilisée
  // getPeriodKeysForCurrentYear,
  isRessourceRelevant,
  isRessourceOnMainScreen,
  isSelectedForCurrentYear,
  setDefaultValueForCurrentYear,
  getIndividuRessourceCategories,
  getIndividuRessourceTypes,
  getIndividuRessourceTypesByCategory,
  setIndividuRessourceTypes,
  unsetForCurrentYear,
}
