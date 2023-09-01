export interface TypicalDates {
  today: {
    id: string
    value: any
    label: string
  }
  thisMonth: TypicalDate
  thisYear: TypicalDate
  oneMonthAgo: TypicalDate
  twoMonthsAgo: TypicalDate
  threeMonthsAgo: TypicalDate
  twelveMonthsAgo: TypicalDate
  last3Months: TypicalDate[]
  last12Months: TypicalDate[]
  lastYear: TypicalDate
  fiscalYear: TypicalDate
  fiscalYear12Months: TypicalDate[]
  previousFiscalYear: TypicalDate
  previousFiscalYear12Months: TypicalDate[]
  threeYearsAgo: TypicalDate
}

export interface TypicalDate {
  id: string
  label: string
}
