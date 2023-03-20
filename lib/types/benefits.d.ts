export interface ConditionsLayout {
  [key: string]: {
    test: any
    extra?: any[]
  }
}

export interface Benefit {
  type?: string
  montant?: number
  mock?: boolean
}
