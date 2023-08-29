import { Request } from "express"
import { FollowupInterface } from "../../lib/types/followup.js"
import { SimulationInterface } from "../../lib/types/simulation.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: SimulationInterface
      followup: FollowupInterface
      situation: any
      simulationId: string
    }
  }
}

export default Request
