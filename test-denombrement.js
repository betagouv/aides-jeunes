const fs = require("fs")
const {
  computeInterestingBenefitCounts,
} = require("./lib/benefits/geographical-count-utils")

const communes = require("@etalab/decoupage-administratif/data/communes.json")
const relevantCommunes = communes.slice(0, 10)
const interestingBenefitsCount = {}
var ProgressBar = require("progress")
var bar = new ProgressBar(":bar :elapsed :eta", {
  total: relevantCommunes.length,
})
relevantCommunes.forEach((ville) => {
  interestingBenefitsCount[ville.code] = computeInterestingBenefitCounts(
    ville.code
  )
  bar.tick()
})

const jsonRepr = JSON.stringify(interestingBenefitsCount, null, 2)
fs.writeFileSync("interesting-benefit-counts.json", jsonRepr)
