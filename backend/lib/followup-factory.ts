import Followups from "../models/followup.js"
import { FollowupInterface } from "@lib/types/followup.js"
import { Simulation } from "@lib/types/simulation.js"
import utils from "../lib/utils.js"

const DefaultVersion = 3
const TokenLength = 17

export const FollowupFactory = {
  create: async (
    simulation: Simulation,
    email: string,
    surveyOptin: boolean
  ): Promise<FollowupInterface> => {
    const situationResults = await simulation.compute()
    const benefits = situationResults.droitsEligibles.map((benefit) => ({
      id: benefit.id,
      amount: benefit.montant,
      unit: benefit.unit,
    }))
    const accessToken = await utils.generateToken(TokenLength)
    const followup = await Followups.create({
      simulation,
      email,
      surveyOptin,
      accessToken,
      benefits,
      version: DefaultVersion,
    })

    simulation.hasFollowup = true
    await simulation.save()

    return followup
  },
}
