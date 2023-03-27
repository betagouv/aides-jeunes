const VERSION = 4

/*
 * Supprime le champ _oldId des followups
 */

export default {
  apply(followup) {
    followup._oldId = undefined
    followup.surveys = followup.surveys.map((survey) => {
      survey._oldId = undefined
      return survey
    })
    return followup
  },
  version: VERSION,
}
