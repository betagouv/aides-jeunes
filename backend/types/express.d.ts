import { Request } from "express"
import { FollowupMongoInterface } from "../models/followup.js"
import { SimulationInterface } from "../models/simulation.js"

export interface SimulationRequest extends Request {
  simulation: SimulationInterface
}

export interface FollowupRequest extends Request {
  followup: FollowupMongoInterface
}
