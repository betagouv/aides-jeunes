import { concat, isNumber, some } from "lodash-es"
import dayjs from "dayjs"

import common from "../common.js"
import individuRessources from "./ressources.js"
import SituationMethods from "../../../../../lib/situation.js"
import ressources from "../../../../../lib/resources.js"

const ressourcesToDuplicate = concat(
  Object.keys(individuRessources.computedRessources),
  ressources.ressourceTypes.map(function (ressourceType) {
    return ressourceType.id
  }),
)

function proxyWithCurrentResources(individu, dateDeValeur) {
  const periods = common.getPeriods(dateDeValeur)
  ressourcesToDuplicate.forEach(function (ressourceTypeName) {
    const result = individu[ressourceTypeName]
    if (!result) return
    // Variables can be defined on a yearly or a monthly basis
    if (isNumber(result[periods.lastYear])) {
      result[periods.fiscalYear] = result[periods.lastYear]
    } else {
      const sumOverLast12Months = periods.last12Months.reduce(function (
        sum,
        periodObject,
      ) {
        return sum + (result[periodObject] || 0)
      }, 0)
      if (sumOverLast12Months) {
        const months = [
          ...periods.fiscalYear12Months,
          ...periods.previousFiscalYear12Months,
        ]
        months.forEach(function (month) {
          result[month] = sumOverLast12Months / 12
        })
      }
    }
  })
}

function extendFiscalDataBackward(individu, dateDeValeur) {
  const periods = common.getPeriods(dateDeValeur)
  const fy = periods.fiscalYear
  const pfy = periods.previousFiscalYear

  ressources.categoriesRnc.forEach(function (ressource) {
    if (!individu[ressource.id]) {
      return
    }

    if (!isNumber(individu[ressource.id][fy])) {
      return
    }

    if (ressource.yearly) {
      individu[ressource.id][pfy] = individu[ressource.id][fy]
    } else {
      const result = individu[ressource.id]
      const monthlyValue = result[fy] / 12

      const months = [
        ...periods.fiscalYear12Months,
        ...periods.previousFiscalYear12Months,
      ]
      months.forEach(function (month) {
        result[month] = monthlyValue
      })

      delete result[fy]
    }
  })
}

function ressourcesYearMoins2Captured(situation) {
  const yearMoins2 = dayjs(situation.dateDeValeur)
    .subtract(2, "year")
    .format("YYYY")
  const januaryYearMoins2 = `${yearMoins2}-01`
  const hasRfr =
    situation.foyer_fiscal && some(situation.foyer_fiscal.rfr, isNumber)
  const hasYm2Ressources = SituationMethods.getIndividusSortedParentsFirst(
    situation,
  ).some(function (individu) {
    return some(ressources.categoriesRnc, function (categorieRnc) {
      if (!individu[categorieRnc.id]) return false

      return some(
        [
          individu[categorieRnc.id][yearMoins2],
          individu[categorieRnc.id][januaryYearMoins2],
        ],
        isNumber,
      )
    })
  })
  return hasRfr || hasYm2Ressources
}

export default function proxyRessources(individu, situation) {
  if (!ressourcesYearMoins2Captured(situation)) {
    proxyWithCurrentResources(individu, situation.dateDeValeur)
  } else {
    extendFiscalDataBackward(individu, situation.dateDeValeur)
  }
}

proxyRessources.proxyWithCurrentResources = proxyWithCurrentResources
proxyRessources.extendFiscalDataBackward = extendFiscalDataBackward
