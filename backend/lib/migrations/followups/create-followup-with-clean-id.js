const mongoose = require("../../mongo-connector")
const Followups = mongoose.model("Followup")

const removeIds = []
const followupsToInsert = []

function cleanObject(doc) {
  const obj = doc.toObject()
  obj._oldId = doc.$errors._id.value
  delete obj._id
  return obj
}

Followups.find({ _id: { $type: "string" } }, {}).then((followups) => {
  if (!followups) return

  followups.forEach((followup, index) => {
    const cleanFollowup = cleanObject(followup)
    removeIds.push(cleanFollowup._oldId)

    cleanFollowup.surveys = followup.surveys.map((survey) =>
      cleanObject(survey)
    )
    console.log(`Duplique followup [${index + 1}/${followups.length}]`)
    followupsToInsert.push(cleanFollowup)
  })

  console.log("Sauvegarde...")
  Followups.insertMany(followupsToInsert).then(() => {
    console.log("Fin de l'ajout")
    process.exit()
  })
})
