export interface Stats {
  metric: string
  datapoints: {
    date: string
    value: string | undefined
  }[]
}

export interface MongoStats {
  dailySituationCount: Stats[]
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
