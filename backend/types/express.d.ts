import { Request } from "express"
import { SimulationModel } from "./models.d.js"
import { FollowupInterface } from "../../lib/types/followup.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: SimulationModel
      followup: FollowupInterface
      situation: any
      simulationId: string
    }
  }
}

export default Request
