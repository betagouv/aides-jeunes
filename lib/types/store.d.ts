import { Answer } from "@lib/types/answer.d.js"
import { StandardBenefit } from "@data/types/benefits.d.js"
import { PatrimoineCategory } from "@lib/enums/patrimoine.js"
import { SimulationStatus } from "@lib/enums/simulation.js"
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

export interface Patrimoine {
  [key: PatrimoineCategory]: number
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
  status: SimulationStatus
  teleservice?: any
}

export interface PersistedStore {
  simulationId: string | null
  simulation: Simulation
  calculs: Calculs
  recapEmailState: string | undefined
  recapPhoneState: string | undefined
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
  modalState: string | null
  saveSituationError: string | null
  openFiscaParameters: OpenfiscaParameters
  recapEmailState: string | undefined
  recapPhoneState: string | undefined
  external_id?: string
  followup?: any
}
