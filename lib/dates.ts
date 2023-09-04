import dayjs, { Dayjs } from "dayjs"
import range from "lodash.range"

import { DatesRange, DateItem } from "./types/dates.js"

function generateMonth(dt: Dayjs): DateItem {
  return {
    id: dt.format("YYYY-MM"),
    label: dt.format("MMMM YYYY"),
  }
}

function generateYear(dt: Dayjs): DateItem {
  const key = dt.format("YYYY")
  return {
    id: key,
    label: key,
  }
}

export const generator = function datesGenerator(
  dateDeValeur: Date | number | string
): DatesRange {
  const ref = dayjs(dateDeValeur)
  return {
    today: {
      id: ref.format("YYYY-MM-DD"),
      value: ref,
      label: "aujourd'hui",
    },
    thisMonth: generateMonth(ref),
    thisYear: generateYear(ref),
    oneMonthAgo: generateMonth(ref.subtract(1, "month")),
    twoMonthsAgo: generateMonth(ref.subtract(2, "month")),
    threeMonthsAgo: generateMonth(ref.subtract(3, "month")),
    twelveMonthsAgo: generateMonth(ref.subtract(12, "month")),
    // 3-element array of the latest 3 month
    last3Months: range(1, 3 + 1).map(function (monthIndex) {
      return generateMonth(ref.subtract(monthIndex, "month"))
    }),
    // 12-element array of the latest 12 month
    last12Months: range(1, 12 + 1).map(function (monthIndex) {
      return generateMonth(ref.subtract(monthIndex, "month"))
    }),
    lastYear: generateYear(ref.subtract(1, "year")),
    fiscalYear: generateYear(ref.subtract(2, "year")),
    // 12-element array of the 12 month in the année fiscale de référence
    fiscalYear12Months: range(12).map(function (monthIndex) {
      const fiscalYear = ref.subtract(2, "year")
      return generateMonth(fiscalYear.month(monthIndex))
    }),
    previousFiscalYear: generateYear(ref.subtract(3, "year")),
    previousFiscalYear12Months: range(12).map(function (monthIndex) {
      const fiscalYear = ref.subtract(3, "year")
      return generateMonth(fiscalYear.month(monthIndex))
    }),
    threeYearsAgo: generateMonth(ref.subtract(3, "year")),
  }
}
