const mongoose = require("../../mongo-connector")
const Followup = mongoose.model("Followup")

console.log("Supprime les anciens followups")
Followup.deleteMany({ _id: { $type: "string" } }).then((res) => {
  console.log("Suppression effectuée")
  console.log(res)
  process.exit()
})
