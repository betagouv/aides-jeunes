import { Request } from "express"
import { IFollowupModel, SimulationModel } from "./models.d.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: SimulationModel
      followup: IFollowupModel
      situation: any
      simulationId: string
    }
  }
}

export default Request
