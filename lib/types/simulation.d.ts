import { Document } from "mongoose"
import { SimulationStatus } from "../enums/simulation.js"
import { Answer } from "@lib/types/answer.d.js"

interface SimulationAttributes {
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
  status: SimulationStatus
  teleservice?: string
  token: string
}

interface SimulationMethods {
  isAccessible(keychain: Record<string, string>): boolean
  getSituation(): any
  compute(): Promise<any>
}

interface SimulationVirtuals {
  cookieName: string
  returnPath: string
}

export interface Simulation
  extends Document,
    SimulationAttributes,
    SimulationMethods,
    SimulationVirtuals {}
