/* eslint-disable prettier-vue/prettier */
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const {
  computeInterestingBenefitCounts,
} = require("../lib/benefits/geographical-count-utils")
const fs = require("fs")

var ProgressBar = require("progress")
var bar = new ProgressBar(":bar :elapsed :eta", {
  total: communes.length,
})

// Nombre d'aides par type d'institution pour 10 communes
let interestingBenefitsList = []
//slice(27000, 27010)
communes
  // .filter((e) => e.region === "84")
  // .slice(27000, 27010)
  .forEach((commune) => {
    const interestingBenefitCounts = computeInterestingBenefitCounts(commune)

    const counts = Object.values(interestingBenefitCounts)
    let total = counts.reduce((accumulator, value) => {
      return accumulator + value
    }, 0)

    interestingBenefitsList.push({
      commune,
      total,
      ...interestingBenefitCounts,
    })
    bar.tick()
  })
// Classement des communes qui ont le plus d'aides jusqu'à celles qui en ont le moins
// console.log(interestingBenefitsList.sort(function (a, b) {
//     return  b.total - a.total;
//   }))

// function communesDetails (departement) {

//   const communesFiltrees = interestingBenefitsList.filter(e => e.commune.departement === departement)
//   return communesFiltrees
// }

// console.log(communesDetails("976"))

// Création d'un fichier JSON qui contient les données stockées dans interestingBenefitsList
fs.writeFileSync(
  "geographical-benefits-details.json",
  JSON.stringify(interestingBenefitsList, null, 2)
)
