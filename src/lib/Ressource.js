import { categoriesRnc, ressourceTypes } from "@/../lib/helpers/Resources"
import filter from "lodash/filter"
import keys from "lodash/keys"
import keyBy from "lodash/keyBy"
import uniq from "lodash/uniq"

function getPeriodsForCurrentYear(dates, ressourceType) {
  let periodKeys = []
  if (ressourceType.isMontantAnnuel) {
    periodKeys.push(dates.lastYear)
    return periodKeys
  }
  if (ressourceType.id.startsWith("rpns_auto_entrepreneur_CA")) {
    periodKeys.push(dates.lastYear)
    // periodKeys = periodKeys.concat(_.map(dates.last3Months, 'id'));
    dates.last3Months.forEach((m) => periodKeys.push(m))
  } else {
    // periodKeys = periodKeys.concat(_.map(dates.last12Months, 'id'));
    dates.last12Months.forEach((m) => periodKeys.push(m))
  }

  if (!ressourceType.revenuExceptionnel) {
    periodKeys.unshift(dates.thisMonth)
  }

  return periodKeys
}

function getPeriodKeysForCurrentYear(dates, ressourceType) {
  return getPeriodsForCurrentYear(dates, ressourceType).map((date) => date.id)
}

function setDefaultValueForCurrentYear(dates, individu, ressourceType) {
  let ressourceId = ressourceType.id
  individu[ressourceId] = individu[ressourceId] || {}
  let ressource = individu[ressourceId]
  let periodKeys = getPeriodKeysForCurrentYear(dates, ressourceType)

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

function unsetForCurrentYear(dates, entity, ressourceType) {
  let ressourceId = ressourceType.id
  entity[ressourceId] = entity[ressourceId] || {}
  let ressource = entity[ressourceId]
  let periodKeys = getPeriodKeysForCurrentYear(dates, ressourceType)
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

function isRessourceRelevant(ressourceType, situation, individu) {
  return (
    !ressourceType.isRelevant || ressourceType.isRelevant(situation, individu)
  )
}

let ressourcesForTrailingMonthsAndFiscalYear = categoriesRnc
  .filter(function (fiscalRessource) {
    return (
      fiscalRessource.sources &&
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
      ressourceTypes,
      (ressourceType) => {
        return (
          isSelectedForCurrentYear(individu[ressourceType.id], ressourceType) &&
          isRessourceOnMainScreen(ressourceType) &&
          isRessourceRelevant(ressourceType, situation, individu)
        )
      },
      {}
    ).map((r) => r.category)
  )
}

function getIndividuRessourceTypes(individu, situation) {
  return filter(ressourceTypes, (ressourceType) => {
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
  return filter(ressourceTypes, (ressourceType) => {
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
  let typeMap = keyBy(filter(ressourceTypes, isRessourceOnMainScreen), "id")

  Object.keys(types).forEach(function (ressourceTypeId) {
    if (types[ressourceTypeId]) {
      setDefaultValueForCurrentYear(dates, individu, typeMap[ressourceTypeId])
    } else {
      unsetForCurrentYear(dates, individu, typeMap[ressourceTypeId])
    }
  })
}

function isRessourceOnMainScreen(ressourceOrType) {
  // Make this function robust so that it can be called with a type from the ressourceTypes constant, or just a string.
  let type = ressourceOrType.id || ressourceOrType
  return type != "pensions_alimentaires_versees_individu"
}

const Ressource = {
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

export default Ressource
