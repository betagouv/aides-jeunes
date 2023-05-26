// import { followupByAccessToken } from "../../backend/controllers/followups.js"
import Followup from "../../backend/models/followup.js"
import { EmailType } from "../../backend/enums/email.js"
import emailRender from "../../backend/lib/mes-aides/emails/email-render.js"
import { SurveyType } from "../../lib/enums/survey.js"

const renderFollowupEmailByType = async (followup, emailType) => {
  let surveyType: SurveyType | undefined

  switch (emailType) {
    case EmailType.simulationResults:
      return emailRender(EmailType.simulationResults, followup)
    case EmailType.simulationUsefulness:
      surveyType = SurveyType.trackClickOnSimulationUsefulnessEmail
      break
    case EmailType.benefitAction:
      surveyType = SurveyType.trackClickOnBenefitActionEmail
      break
    default:
      throw new Error(`Unknown email type: ${emailType}`)
  }

  return followup.renderSurveyEmail(surveyType)
}

const getFollowupEmail = async (req, res, next) => {
  try {
    const followup = await Followup.findById(req.params.followupId)
    const { emailType } = req.query
    const result = await renderFollowupEmailByType(followup, emailType)
    res.send(result["html"])
  } catch (err) {
    next(err)
  }
}

export default {
  getFollowupEmail,
}
