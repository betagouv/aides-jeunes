import { Request } from "express"
import { FollowupMongoInterface } from "../models/followup.js"
import { SimulationModel } from "./models.d.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: SimulationModel
      followup: FollowupMongoInterface
      situation: any
      simulationId: string
    }
  }
}

export default Request
