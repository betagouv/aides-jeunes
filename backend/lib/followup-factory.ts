import Followup from "../models/followup.js"
import utils from "../lib/utils.js"

const DefaultVersion = 3
const TokenLength = 17

export const FollowupFactory = {
  create: async (simulation, email, surveyOptin) => {
    const situationResults = await simulation.compute()
    const benefits = situationResults.droitsEligibles.map((benefit) => ({
      id: benefit.id,
      amount: benefit.montant,
      unit: benefit.unit,
    }))
    const accessToken = await utils.generateToken(TokenLength)
    const followup = await Followup.create({
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
