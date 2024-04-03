const VERSION = 5

export default {
  apply(followup) {
    followup.surveys = followup.surveys.map((survey) => {
      survey.touchedAts = [survey.openedAt]
      return survey
    })
    return followup
  },
  version: VERSION,
}
