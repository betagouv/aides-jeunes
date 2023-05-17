import Followup from "../../backend/models/followup.js"
import { ajRequest } from "../../backend/types/express.d.js"
import { EmailType } from "../../backend/enums/email.js"
import emailRender from "../../backend/lib/mes-aides/emails/email-render.js"
import { SurveyType } from "../../lib/enums/survey.js"
import jwt from "jsonwebtoken"
import config from "../config/index.js"

const emailRoutes = function (api) {
  const renderFollowupEmail = async (followup, emailType) => {
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
        return
    }

    if (!surveyType) {
      return
    }

    return followup.renderSurveyEmail(surveyType)
  }

  api.route("/email/:token").get(async (req: ajRequest, res, next) => {
    try {
      const { followupId, emailType } = jwt.verify(
        req.params.token,
        config.sessionSecret
      )
      const followup = await Followup.findById(followupId).populate(
        "simulation"
      )
      if (!followup) {
        return res.sendStatus(404)
      }
      const result = await renderFollowupEmail(followup, emailType)
      res.send(result["html"])
    } catch (err) {
      next(err)
    }
  })
}
export default emailRoutes
