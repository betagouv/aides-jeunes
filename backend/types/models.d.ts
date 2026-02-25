import { Model, HydratedDocument } from "mongoose"
import { Contribution } from "@lib/types/contributions.d.js"
import { Followup } from "@lib/types/followup.d.js"
import { Simulation } from "@lib/types/simulation.d.js"

export interface Mongoose {
  [id: string]: any
}

interface FollowupStaticMethods {
  findByEmail(email: string): Promise<HydratedDocument<Followup[]>>
}

export interface FollowupModel extends Model<Followup>, FollowupStaticMethods {}

export type ContributionModel = Model<Contribution>

interface SimulationStaticMethods {
  cookiePrefix(): string
}

export interface SimulationModel
  extends Model<Simulation>,
    SimulationStaticMethods {}
