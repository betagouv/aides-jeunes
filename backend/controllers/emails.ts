import { EmailCategory } from "../../lib/enums/messaging.js"
import {
  emailRender,
  renderSurveyEmail,
} from "../../backend/lib/mes-aides/emails/email-render.js"
import { SurveyCategory } from "../../lib/enums/survey.js"

const renderFollowupEmailByType = async (
  followup,
  emailType: EmailCategory
) => {
  let surveyType: SurveyCategory | undefined

  switch (emailType) {
    case EmailCategory.SimulationResults:
      return emailRender(EmailCategory.SimulationResults, followup)
    case EmailCategory.SimulationUsefulness:
      surveyType = SurveyCategory.TrackClickOnSimulationUsefulnessEmail
      break
    case EmailCategory.BenefitAction:
      surveyType = SurveyCategory.TrackClickOnBenefitActionEmail
      break
    default:
      throw new Error(`Unknown email type: ${emailType}`)
  }

  return renderSurveyEmail(surveyType, followup)
}

const getFollowupEmail = async (req, res, next) => {
  try {
    const { emailType }: { emailType: EmailCategory } = req.query
    const followup = req.followup
    const result = await renderFollowupEmailByType(followup, emailType)
    res.send(result["html"])
  } catch (err) {
    next(err)
  }
}

export default {
  getFollowupEmail,
}
