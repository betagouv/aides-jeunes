const dayjs = require("dayjs")
const range = require("lodash/range")

function generateMonth(dt) {
  return {
    id: dt.format("YYYY-MM"),
    label: dt.format("MMMM YYYY"),
  }
}

function generateYear(dt) {
  const key = dt.format("YYYY")
  return {
    id: key,
    label: key,
  }
}

function datesGenerator(dateDeValeur) {
  const ref = dayjs(dateDeValeur)
  return {
    today: {
      id: ref.format("YYYY-MM-DD"),
      value: ref,
      label: "aujourd'hui",
    },
    thisMonth: generateMonth(ref),
    thisYear: generateYear(ref),
    oneMonthAgo: generateMonth(ref.clone().subtract(1, "month")),
    twoMonthsAgo: generateMonth(ref.clone().subtract(2, "month")),
    threeMonthsAgo: generateMonth(ref.clone().subtract(3, "month")),
    twelveMonthsAgo: generateMonth(ref.clone().subtract(12, "month")),
    // 3-element array of the latest 3 month
    last3Months: range(1, 3 + 1).map(function (monthIndex) {
      return generateMonth(ref.clone().subtract(monthIndex, "month"))
    }),
    // 12-element array of the latest 12 month
    last12Months: range(1, 12 + 1).map(function (monthIndex) {
      return generateMonth(ref.clone().subtract(monthIndex, "month"))
    }),
    lastYear: generateYear(ref.clone().subtract(1, "year")),
    fiscalYear: generateYear(ref.clone().subtract(2, "year")),
    // 12-element array of the 12 month in the année fiscale de référence
    fiscalYear12Months: range(12).map(function (monthIndex) {
      const fiscalYear = dayjs(ref.clone().subtract(2, "year").year(), "YYYY")
      return generateMonth(fiscalYear.clone().add(monthIndex, "month"))
    }),
    previousFiscalYear: generateYear(ref.clone().subtract(3, "year")),
    previousFiscalYear12Months: range(12).map(function (monthIndex) {
      const fiscalYear = dayjs(ref.clone().subtract(3, "year").year(), "YYYY")
      return generateMonth(fiscalYear.clone().add(monthIndex, "month"))
    }),
    threeYearsAgo: generateMonth(ref.clone().subtract(3, "year")),
  }
}

exports.generator = datesGenerator
