import { Request } from "express"
import { FollowupInterface } from "../../lib/types/followup.js"
import { Simulation } from "../../lib/types/simulation.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: Simulation
      followup: FollowupInterface
      situation: any
      simulationId: string
    }
  }
}

export default Request
