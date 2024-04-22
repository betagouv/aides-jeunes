import { Request } from "express"
import { Followup } from "../../lib/types/followup.js"
import { Simulation } from "../../lib/types/simulation.js"

declare global {
  export namespace Express {
    interface Request {
      simulation: Simulation
      followup: Followup
      situation: any
      simulationId: string
      redirectTo: string
    }
  }
}

export default Request
