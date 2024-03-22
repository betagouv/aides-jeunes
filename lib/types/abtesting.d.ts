export interface ABTesting {
  [key: string]: {
    index: number
    value: string
    deleted?: boolean
  }
}

export interface ABTestingService {
  getEnvironment: () => ABTesting
  getValues: () => { [key: string]: string }
  setVariant(key: string, value: string)
}
