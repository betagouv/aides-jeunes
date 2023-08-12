import { Request } from "express"
import { FollowupModel, SimulationModel } from "./models.d.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: SimulationModel
      followup: FollowupModel
      situation: any
      simulationId: string
    }
  }
}

export default Request
