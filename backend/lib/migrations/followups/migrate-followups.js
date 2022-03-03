// Connect to mongoose
const mongoose = require("mongoose")
const config = require("../../../config")
// Setup mongoose
require("../../../config/mongoose")(mongoose, config)
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

  followups.forEach((followup) => {
    const cleanFollowup = cleanObject(followup)
    removeIds.push(cleanFollowup._oldId)

    cleanFollowup.surveys = followup.surveys.map((survey) =>
      cleanObject(survey)
    )
    followupsToInsert.push(cleanFollowup)
    followup.delete()
  })

  Followups.insertMany(followupsToInsert).then(() => {
    console.log("fin")
    // Followups.deleteMany({ _id: { $in: removeIds } }, { strictQuery: false })
    //   .then((res) => {
    //     console.log(res)
    //   })
    // })
  })
})
