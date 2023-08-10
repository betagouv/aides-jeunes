import { Request } from "express"
import { FollowupMongoInterface } from "../models/followup.js"
import { SimulationInterface } from "../models/simulation.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: SimulationInterface
      followup: FollowupMongoInterface
      situation: any
      simulationId: string
    }
  }
}

export default Request
