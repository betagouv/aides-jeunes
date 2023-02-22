export interface StatsLayout {
  metric: string
  datapoints: {
    date: string
    value: string | undefined
  }[]
}

export interface MongoStatsLayout {
  dailySituationCount: StatsLayout[]
  survey: {
    summary: {
      total: number
      asked: number
    }
    details: any
  }
  details: {
    id: string
    total: number
    asked?: number
    failed?: number
    nothing?: number
    already?: number
  }[]
}
