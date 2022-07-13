const aides = require("../aids.json")

// combien d'aides dans le fichier ?
//console.log(`Nombre d'aides au total : ${aides.length}`)

const interestingSlugs = [
  "bourse-communale-au-permis-de-conduire-lyon",
  "aide-regionale-au-permis-de-conduire-auvergne-rhone-alpes",
  "aide-departementale-au-permis-de-conduire-rhone",
  "bourse-communale-au-permis-de-conduire-arnas",
]


const interestingSlugMap2 = interestingSlugs.reduce((accumulator, item) => {
  accumulator[item] = 1
  return accumulator
}, {})
//console.log(interestingSlugMap2)

// nombres d'aides par rapport aux slugs qui nous intéressent
const filterAides = aides.filter(
  (aide) => interestingSlugs.indexOf(aide.slug) >= 0
)
console.log(filterAides)
//console.log(
//   "Nombre d'aides par rapport aux slugs sélectionnés:",
//   filterAides.length
// )

//quel type d'aide? régionales, départementales, communales
const typeAides = aides.map((aide) => aide.geographicalArea)
const filteredTypeArray = typeAides.filter(function (element, position) {
  return typeAides.indexOf(element) == position
})
console.log("The filtered array ", filteredTypeArray)

// combien d'aides régionales, départementales, communales ?
const geoCounts = {}
aides.forEach((aide) => {
  geoCounts[aide.slug] = (geoCounts[aide.slug] || 0) + 1
})
//console.log(geoCounts)

// comment sont structurées les infos de condition?

// combien d'aides régionales, départementales, communales ?
const numberConditions = aides.map((aide) => aide.conditions)
//console.log(numberConditions)
const conditionsLengthCounts = {}
aides.forEach((aide) => {
  conditionsLengthCounts[aide.conditions.length] =
    (conditionsLengthCounts[aide.conditions.length] || 0) + 1
})
//console.log(conditionsLengthCounts)

const conditionsCount = {}
aides.forEach((aide) => {
  aide.conditions.forEach((condition) => {
    conditionsCount[condition] = (conditionsCount[condition] || 0) + 1
  })
})
//console.log(conditionsCount)
//console.log("Nombre d'aides:", Object.keys(conditionsCount).length)
//process.exit(0)

// dire combien d'aides ont 0, 1, 2 ... conditions

//console.log("Nombre d'aides selon conditions ")

const othersConditionsCounts = {}
aides.forEach((aide) => {
  othersConditionsCounts[aide.otherConditions] =
    (othersConditionsCounts[aide.otherConditions] || 0) + 1
})
//console.log(othersConditionsCounts)
//console.log(Object.keys(othersConditionsCounts).length)

const othersConditionsCompsCounts = {}
aides.forEach((aide) => {
  if (!aide.otherConditions) {
    return
  }
  const conditions = aide.otherConditions.split("\n")
  conditions.forEach((condition) => {
    othersConditionsCompsCounts[condition] =
      (othersConditionsCompsCounts[condition] || 0) + 1
  })
})
//console.log(othersConditionsCompsCounts)
//console.log(Object.values(othersConditionsCompsCounts).length)
