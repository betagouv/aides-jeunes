import { EmailType } from "../../lib/enums/messaging.js"
import { SurveyType } from "../../lib/enums/survey.js"
import {
  emailRender,
  emailRenderBySurveyType,
} from "../../backend/lib/mes-aides/emails/email-render.js"
import * as Sentry from "@sentry/node"

const renderEmailByType = async (followup, emailType: EmailType) => {
  let surveyType: SurveyType | undefined

  switch (emailType) {
    case EmailType.SimulationResults:
      return emailRender(EmailType.SimulationResults, followup)
    case EmailType.SimulationUsefulness:
      surveyType = SurveyType.TrackClickOnSimulationUsefulnessEmail
      break
    default:
      throw new Error(`Unknown email type: ${emailType}`)
  }
  return emailRenderBySurveyType(surveyType, followup)
}

const getFollowupEmail = async (req, res, next) => {
  try {
    const { emailType }: { emailType: EmailType } = req.query
    const followup = req.followup
    const result = await renderEmailByType(followup, emailType)
    res.send(result?.html)
  } catch (err) {
    Sentry.captureException(err)
    next(err)
  }
}

export default {
  getFollowupEmail,
}
