const mongoose = require("../../mongo-connector")
const Followups = mongoose.model("Followup")

const followupsToInsert = []

function cleanObject(doc) {
  const obj = doc.toObject()
  delete obj._id
  return obj
}

Followups.find({ _id: { $type: "string" } }, {}).then((followups) => {
  if (!followups) return

  followups.forEach((followup, index) => {
    const cleanFollowup = cleanObject(followup)

    cleanFollowup.surveys = followup.surveys.map((survey) =>
      cleanObject(survey)
    )
    followupsToInsert.push(cleanFollowup)
    console.log(`Duplique followup [${index + 1}/${followups.length}]`)
  })

  console.log("Sauvegarde...")
  Followups.insertMany(followupsToInsert).then(() => {
    console.log("Fin de l'ajout")
    process.exit()
  })
})
