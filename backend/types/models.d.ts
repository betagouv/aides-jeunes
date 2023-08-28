import mongoose, { Model, HydratedDocument } from "mongoose"
import { FollowupInterface } from "@lib/types/followup.d.js"
import { SimulationInterface } from "@lib/types/simulation.d.js"

export interface MongooseLayout {
  [id: string]: any
}

export interface IFollowupModel extends Model<FollowupInterface> {
  findByEmail(email: string): Promise<HydratedDocument<FollowupInterface>>
}

export interface SimulationModel extends Model<SimulationInterface> {
  _id: mongoose.Types.ObjectId
  cookieName: string
  token: string
  returnPath: string
  isAccessible(keychain: Record<string, string>): boolean
  getSituation(): any
  compute(): Promise<any>
  findById(
    simulationId: mongoose.Types.ObjectId | string,
    callback: (error: Error, simulation: SimulationModel) => void
  )
  cookiePrefix(): string
  create(
    data: any,
    callback: (error: Error, simulation: SimulationModel) => void
  )
  hasFollowup: boolean
  save()
}
