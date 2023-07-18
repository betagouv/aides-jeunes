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
