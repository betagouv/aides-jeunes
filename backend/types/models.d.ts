import { Model, HydratedDocument } from "mongoose"
import { Followup } from "@lib/types/followup.d.js"
import { Simulation } from "@lib/types/simulation.d.js"

export interface Mongoose {
  [id: string]: any
}

interface FollowupStaticMethods {
  findByEmail(email: string): Promise<HydratedDocument<Followup[]>>
}

export interface IFollowupModel
  extends Model<Followup>,
    FollowupStaticMethods {}

interface SimulationStaticMethods {
  cookiePrefix(): string
}

export interface SimulationModel
  extends Model<Simulation>,
    SimulationStaticMethods {}
