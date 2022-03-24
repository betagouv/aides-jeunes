const subject = require("../data/all")

console.log(subject)

console.log(
  subject.all.find((benefit) => {
    return benefit.institution.type === "region"
  })
)
