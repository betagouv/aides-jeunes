import Followup from "../../backend/models/followup.js"
import { ajRequest } from "../../backend/types/express.d.js"
import { EmailType } from "../../backend/enums/email.js"
import emailRender from "../../backend/lib/mes-aides/emails/email-render.js"
import { SurveyType } from "../../lib/enums/survey.js"

const emailRoutes = function (api) {
  const renderFollowupEmail = async (req: ajRequest) => {
    const { followup } = req
    const { type: emailType } = req.params
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

  api
    .route("/email/:followupId/:type")
    .get(async (req: ajRequest, res, next) => {
      try {
        const followup = await Followup.findById(
          req.params.followupId
        ).populate("simulation")
        if (!followup) {
          return res.sendStatus(404)
        }
        req.followup = followup
        const result = await renderFollowupEmail(req)
        res.send(result["html"])
      } catch (err) {
        next(err)
      }
    })
}
export default emailRoutes
