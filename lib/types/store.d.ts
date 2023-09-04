import { StandardBenefit } from "@data/types/benefits.d.js"
import { PatrimoineTypes } from "@lib/enums/patrimoine.js"

export interface Resultats {
  _id?: string
  droitsEligibles: StandardBenefit[] | null
  droitsInjectes: StandardBenefit[] | null
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
  path: string
}

export interface Patrimoine {
  [key: PatrimoineTypes]: number
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

export interface PersistedStore {
  simulationId: string | null
  simulation: Simulation
  calculs: Calculs
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
  title: string | null
  inIframe: boolean
  iframeOrigin: string | null
  iframeHeaderCollapse: boolean
  saveSituationError: string | null
  openFiscaParameters: OpenfiscaParameters
  recapEmailState: string | undefined
  external_id?: string
}
