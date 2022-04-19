const mongoose = require("../../mongo-connector")
const Followups = mongoose.model("Followup")

Followups.deleteMany({ _id: { $type: "string" } }).then((res) => {
  console.log("Supprime les anciens followups")
  console.log(res)
})
