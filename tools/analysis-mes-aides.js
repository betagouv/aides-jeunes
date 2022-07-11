const aides = require("../aids.json")

const interestingSlugs = [
  "bourse-communale-au-permis-de-conduire-lyon",
  "aide-regionale-au-permis-de-conduire-auvergne-rhone-alpes",
  "aide-departementale-au-permis-de-conduire-rhone",
  "bourse-communale-au-permis-de-conduire-arnas",
]

const interestingSlugMap = {
  "bourse-communale-au-permis-de-conduire-lyon": 1,
  "aide-regionale-au-permis-de-conduire-auvergne-rhone-alpes": 1,
  "aide-departementale-au-permis-de-conduire-rhone": 1,
  "bourse-communale-au-permis-de-conduire-arnas": 1,
}

const interestingSlugMap2 = interestingSlugs.reduce((accumulator, item) => {
  accumulator[item] = 1
  return accumulator
}, {})

const filterAides = aides.filter(
  (aide) => interestingSlugs.indexOf(aide.slug) >= 0
  //  (aide) => interestingSlugs.find(item => item === aide.slug)
  //  (aide) => interestingSlugMap[aide.slug]
  //  (aide) => interestingSlugMap2[aide.slug]
)
console.log(filterAides)

// combien d'aides dans le fichier ?
console.log(`Nombre d'aides au total : ${aides.length}`)

//process.exit(0)
//quel type d'aide? régionales, départementales, communales
const typeAides = aides.map((aide) => aide.geographicalArea)
const filteredTypeArray = typeAides.filter(function (element, position) {
  return typeAides.indexOf(element) == position
})
//console.log("The filtered array ", filteredTypeArray)

// combien d'aides régionales, départementales, communales ?
const geoCounts = {}
aides.forEach((aide) => {
  //const rawInitialValue = geoCounts[aide.geographicalArea]
  //const initialValue = rawInitialValue === undefined ? 0 : rawInitialValue
  //const initialValue = rawInitialValue || 0
  //const newValue = initialValue + 1
  //geoCounts[aide.geographicalArea] = newValue
  geoCounts[aide.geographicalArea] = (geoCounts[aide.geographicalArea] || 0) + 1
})
console.log(geoCounts)
/*
function isOdd(v) {
  const result = v % 2 == 1
  console.log(`${v} is odd ${result}.`)
  return result
}

isOdd(1)
isOdd(2)
isOdd(3)
isOdd(4)

console.log('Result:')
console.log(isOdd(1) && isOdd(2) && isOdd(3))

console.log('Result:')
console.log(isOdd(2) || isOdd(3) || isOdd(4))
*/

// comment sont structurées les infos de condition?

// combien d'aides régionales, départementales, communales ?
const geoCounts = {}
aides.forEach((aide) => {
  geoCounts[aide.geographicalArea] = (geoCounts[aide.geographicalArea] || 0) + 1
})
console.log(geoCounts)

// dire combien d'aides ont 0, 1, 2 ... conditions
const conditionAides1 = aides.filter((aide) => aide.conditions.length == 0)
const conditionAides2 = aides.filter((aide) => aide.conditions.length == 1)
const conditionAides3 = aides.filter((aide) => aide.conditions.length == 2)
const conditionAides4 = aides.filter((aide) => aide.conditions.length == 3)
const conditionAides5 = aides.filter((aide) => aide.conditions.length == 4)
const conditionAides6 = aides.filter((aide) => aide.conditions.length == 5)
const conditionAides7 = aides.filter((aide) => aide.conditions.length == 6)
const conditionAides8 = aides.filter((aide) => aide.conditions.length == 7)
const conditionAides9 = aides.filter((aide) => aide.conditions.length == 8)

console.log(
  "Nombre d'aides selon conditions ",
  conditionAides1.length,
  conditionAides2.length,
  conditionAides3.length,
  conditionAides4.length,
  conditionAides5.length,
  conditionAides6.length,
  conditionAides7.length,
  conditionAides8.length,
  conditionAides9.length
)
