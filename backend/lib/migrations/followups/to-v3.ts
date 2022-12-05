const VERSION = 3

// Migre les valeurs des champs initial à benefit-action
// dans le tableau de surveys de l'objet Followup

const updateFollowupSurveysType = (followup) => {
  const surveys = followup.surveys.map((survey) => {
    if (survey.type === "initial") {
      return {
        ...survey,
        type: "benefit-action",
      }
    }
    return survey
  })
  followup.surveys = surveys
}

export default {
  apply(followup) {
    if (followup.surveys?.length > 0) {
      updateFollowupSurveysType(followup)
    }
    return followup
  },
  version: VERSION,
}
