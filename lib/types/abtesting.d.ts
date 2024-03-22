export interface ABTesting {
  [key: string]: {
    index: number
    value: string
    deleted?: boolean
  }
}

export interface ABTestingService {
  getEnvironment?: () => ABTesting
}
