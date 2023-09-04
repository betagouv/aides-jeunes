import { Model, HydratedDocument } from "mongoose"
import { FollowupInterface } from "@lib/types/followup.d.js"
import { SimulationInterface } from "@lib/types/simulation.d.js"

export interface Mongoose {
  [id: string]: any
}

interface FollowupStaticMethods {
  findByEmail(email: string): Promise<HydratedDocument<FollowupInterface[]>>
}

export interface IFollowupModel
  extends Model<FollowupInterface>,
    FollowupStaticMethods {}

interface SimulationStaticMethods {
  cookiePrefix(): string
}

export interface SimulationModel
  extends Model<SimulationInterface>,
    SimulationStaticMethods {}
