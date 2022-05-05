/*
 * Ajoute un accessToken pour chaque followup
 */

const VERSION = 2

module.exports = {
  function: async function (followup) {
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
