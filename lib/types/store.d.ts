export interface Resultats {
  _id?: string
  droitsEligibles: [] | null
  droitsInjectes: [] | null
}

export interface Calculs {
  resultats: Resultats
  dirty: boolean
  error: boolean
  exception: boolean
  updating: boolean
}

export interface OpenfiscaParameters {
  [key: string]: any
}

export interface Answer {
  id: string
  entityName: string
  fieldName: string
  value: any
}

export interface Patrimoine {
  [key: string]: any
}

export interface RessourcesFiscales {
  [individu: string]: { [key: string]: any }
}

export interface Simulation {
  modifiedFrom?: string
  answers: {
    all: Answer[]
    current: Answer[]
  }
  dateDeValeur: Date | string
  version: number
  enfants?: number[]
  patrimoine?: Patrimoine
  ressourcesFiscales?: RessourcesFiscales
  abtesting?: any
  simulationToken?: string | undefined
}

export interface Situation {
  [entity: string]: {
    [key: string]: any
  }
}

export interface PersistedStore {
  simulationId: string | null
  simulation: Simulation
  calculs: Calculs
  ameliNoticationDone: boolean
  recapEmailState: string | undefined
  dates?: any
}

export interface Store {
  simulationId: string | null
  simulation: Simulation
  message: {
    text: string | null
    counter: number | null
  }
  debug: boolean
  error: string | boolean
  access: {
    fetching: boolean
    forbidden: boolean
  }
  calculs: Calculs
  // TODO Add type of dates
  dates: any
  ameliNoticationDone: boolean
  title: string | null
  inIframe: boolean
  iframeOrigin: string | null
  iframeHeaderCollapse: boolean
  saveSituationError: string | null
  openFiscaParameters: OpenfiscaParameters
  recapEmailState: string | undefined
  external_id?: string
}
