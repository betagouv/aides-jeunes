import mongoose, { Model } from "mongoose"
import { Simulation } from "@lib/types/simulation.d.js"
export interface MongooseLayout {
  [id: string]: any
}
export interface FollowupModel extends Model<MongooseLayout> {
  findByEmail(id: string): any
}

export interface SimulationModel extends Simulation {
  _id: mongoose.Types.ObjectId
  cookieName: string
  returnPath: string
  isAccessible(keychain: Record<string, string>): boolean
  getSituation(): any
  compute(): Promise<any>
  findById(
    simulationId: mongoose.Types.ObjectId,
    callback: (error: Error, followup: SimulationModel) => void
  )
  cookiePrefix(): string
  create(data: any, callback: (error: Error, followup: SimulationModel) => void)
}
