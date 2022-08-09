/*
 * Ajoute un accessToken pour chaque followup
 */

const VERSION = 2

export default {
  function(followup) {
    if (!followup.accessToken) {
      const survey = followup.surveys?.[0]
      if (survey) {
        if (survey?.accessToken) {
          followup.accessToken = survey.accessToken
        } else {
          followup.accessToken = survey._oldId
        }
      } else {
        followup.accessToken = followup._oldId
      }
    }
    return followup
  },
  version: VERSION,
}
