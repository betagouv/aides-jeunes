import {
  SimulationStatusEnum,
  SimulationFranceConnectStatusEnum,
} from "../enums/simulation.js"

export interface Answer {
  id: string
  entityName: string
  fieldName: string
  value: any
  path: string
}

export interface SimulationInterface {
  _id: string
  answers: {
    all: Answer[]
    current: Answer[]
  }
  enfants: number[]
  ressourcesFiscales?: any
  patrimoine?: any
  dateDeValeur: Date
  version: number
  abtesting?: any
  finishedAt: Date
  createdAt: Date
  hasFollowup?: boolean
  modifiedFrom?: string
  status: SimulationStatusEnum
  franceConnectStatus: SimulationFranceConnectStatusEnum
  teleservice?: string
  token: string
}
