import { Request } from "express"
import { FollowupMongoInterface } from "../models/followup.js"
import { SimulationInterface } from "../models/simulation.js"

export interface SimulatorRequest extends Request {
  simulation: SimulationInterface
  followup: FollowupMongoInterface
  situation: any
  simulationId: string
}
