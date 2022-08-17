import dayjs from "dayjs"
import { range } from "lodash-es"

import { datesGeneratorLayout, dateLayout } from "./types/dates"

function generateMonth(dt: any): dateLayout {
  return {
    id: dt.format("YYYY-MM"),
    label: dt.format("MMMM YYYY"),
  }
}

function generateYear(dt: any): dateLayout {
  const key = dt.format("YYYY")
  return {
    id: key,
    label: key,
  }
}

export const generator = function datesGenerator(
  dateDeValeur: Date | number | string
): datesGeneratorLayout {
  const ref = dayjs(dateDeValeur)
  return {
    fiscalYear: generateYear(ref.subtract(2, "year")),

    // 12-element array of the 12 month in the année fiscale de référence
    fiscalYear12Months: range(12).map(function (monthIndex) {
      const fiscalYear = ref.subtract(2, "year")
      return generateMonth(fiscalYear.month(monthIndex))
    }),

    // 3-element array of the latest 3 month
    last3Months: range(1, 3 + 1).map(function (monthIndex) {
      return generateMonth(ref.subtract(monthIndex, "month"))
    }),

    // 12-element array of the latest 12 month
    last12Months: range(1, 12 + 1).map(function (monthIndex) {
      return generateMonth(ref.subtract(monthIndex, "month"))
    }),

    lastYear: generateYear(ref.subtract(1, "year")),

    oneMonthAgo: generateMonth(ref.subtract(1, "month")),

    previousFiscalYear: generateYear(ref.subtract(3, "year")),

    previousFiscalYear12Months: range(12).map(function (monthIndex) {
      const fiscalYear = ref.subtract(3, "year")
      return generateMonth(fiscalYear.month(monthIndex))
    }),

    thisMonth: generateMonth(ref),

    thisYear: generateYear(ref),

    threeMonthsAgo: generateMonth(ref.subtract(3, "month")),

    threeYearsAgo: generateMonth(ref.subtract(3, "year")),
    today: {
      id: ref.format("YYYY-MM-DD"),
      label: "aujourd'hui",
      value: ref,
    },
    twelveMonthsAgo: generateMonth(ref.subtract(12, "month")),
    twoMonthsAgo: generateMonth(ref.subtract(2, "month")),
  }
}
