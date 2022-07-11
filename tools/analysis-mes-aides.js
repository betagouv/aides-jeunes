const aides = require("../aids.json")

// console.log(aides)

const interestingSlugs = [
  "bourse-communale-au-permis-de-conduire-lyon",
  "aide-regionale-au-permis-de-conduire-auvergne-rhone-alpes",
  "aide-departementale-au-permis-de-conduire-rhone",
  "bourse-communale-au-permis-de-conduire-arnas",
]

//
const filterAides = aides.filter(
  (aide) =>
    aide.slug == interestingSlugs[0] ||
    aide.slug == interestingSlugs[1] ||
    aide.slug == interestingSlugs[2] ||
    aide.slug == interestingSlugs[3]
)

//console.log(filterAides)
console.log("Nombre d'aides: ", filterAides.length)

//quel type d'aide? régionales, départementales, communales
const typeAides = aides.map((aide) => aide.type)
const filteredTypeArray = typeAides.filter(function (element, position) {
  return typeAides.indexOf(element) == position
})
console.log("The filtered array ", filteredTypeArray)

// combien d'aides régionales, départementales, communales ?

// comment sont structurées les infos de condition?

// combien d'aides dans le fichier ?
const numberAides = aides.map((aide) => aide.organism.noAids)
//const numberAides = aides.map((aide) => aide.type)
console.log("nombre d'aides ", numberAides.length)

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
