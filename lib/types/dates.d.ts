export interface DatesRange {
  today: {
    id: string
    value: any
    label: string
  }
  thisMonth: DateItem
  thisYear: DateItem
  oneMonthAgo: DateItem
  twoMonthsAgo: DateItem
  threeMonthsAgo: DateItem
  twelveMonthsAgo: DateItem
  last3Months: DateItem[]
  last12Months: DateItem[]
  lastYear: DateItem
  fiscalYear: DateItem
  fiscalYear12Months: DateItem[]
  previousFiscalYear: DateItem
  previousFiscalYear12Months: DateItem[]
  threeYearsAgo: DateItem
}

export interface DateItem {
  id: string
  label: string
}
