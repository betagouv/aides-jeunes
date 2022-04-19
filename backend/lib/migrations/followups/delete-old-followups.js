const mongoose = require("../../mongo-connector")
const Followups = mongoose.model("Followup")

console.log("Supprime les anciens followups")
Followups.deleteMany({ _id: { $type: "string" } }).then((res) => {
  console.log("Suppression effectuée")
  console.log(res)
  process.exit()
})
