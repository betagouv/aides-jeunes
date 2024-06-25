import { SurveyType } from "../../../../lib/enums/survey.js"

const VERSION = 6

export default {
  apply(followup) {
    followup.surveys = followup.surveys.map((survey) => {
      if (survey.type === "track-click-on-benefit-action-email") {
        survey.type = SurveyType.TrackClickOnSimulationUsefulnessEmail
      }
      return survey
    })
    return followup
  },
  version: VERSION,
}
