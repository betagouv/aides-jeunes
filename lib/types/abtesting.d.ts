export interface ABTesting {
  [key: string]: {
    index: number
    value: string
    deleted?: boolean
  }
}

export interface ABTestingService {
<<<<<<< HEAD
  getEnvironment: () => ABTesting
  getValues: () => { [key: string]: string }
  setVariant(key: string, value: string)
=======
  getEnvironment?: () => ABTesting
>>>>>>> Permet l'accès aux infos d'AB test dans les questions
}
