export interface typicalDatesLayout {
  today: {
    id: string
    value: any
    label: string
  }
  thisMonth: dateLayout
  thisYear: dateLayout
  oneMonthAgo: dateLayout
  twoMonthsAgo: dateLayout
  threeMonthsAgo: dateLayout
  twelveMonthsAgo: dateLayout
  last3Months: dateLayout[]
  last12Months: dateLayout[]
  lastYear: dateLayout
  fiscalYear: dateLayout
  fiscalYear12Months: dateLayout[]
  previousFiscalYear: dateLayout
  previousFiscalYear12Months: dateLayout[]
  threeYearsAgo: dateLayout
}

export interface dateLayout {
  id: string
  label: string
}

export interface PeriodsLayout {
  today: string
  thisMonth: string
  thisYear: string
  oneMonthAgo: string
  twoMonthsAgo: string
  threeMonthsAgo: string
  twelveMonthsAgo: string
  last3Months: string[]
  last12Months: string[]
  lastYear: string
  fiscalYear: string
  fiscalYear12Months: string[]
  previousFiscalYear: string
  previousFiscalYear12Months: string[]
  threeYearsAgo: string
}
