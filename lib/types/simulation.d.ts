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
  computedResults?: ComputedResults
}

interface ComputedResults {
  signature?: string
  computedAt?: Date
  results?: any
}

interface ComputeOptions {
  /** Résultat enrichi réservé aux outils internes, jamais mis en cache. */
  showPrivate?: boolean
  /**
   * `false` pour les appelants qui modifient le document en mémoire avant de
   * calculer : leur résultat ne décrit pas le document persisté et ne doit ni
   * être lu ni évincer l'entrée de cache de l'usager.
   */
  cache?: boolean
}

interface SimulationMethods {
  isAccessible(keychain: Record<string, string>): boolean
  getSituation(): any
  compute(options?: ComputeOptions): Promise<any>
}

interface SimulationVirtuals {
  cookieName: string
}

export interface Simulation
  extends Document,
    SimulationAttributes,
    SimulationMethods,
    SimulationVirtuals {}
