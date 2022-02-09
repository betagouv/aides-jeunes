const communesDetails = require("../geographical-benefits-details.json")

function computeBenefitsAverage() {
  const benefitsByPopulationList = []
  const totalPopulationList = []

  const communeIds = Object.keys(communesDetails)

  communeIds.forEach((id) => {
    const commune = communesDetails[id]
    const benefits = commune.count
    const population = commune.population || 0
    const benefitsByPopulation = benefits * population

    benefitsByPopulationList.push(benefitsByPopulation)
    totalPopulationList.push(population)
  })

  const totalBenefits = benefitsByPopulationList.reduce(
    (accumulator, value) => {
      return accumulator + value
    },
    0
  )
  const totalPopulation = totalPopulationList.reduce((accumulator, value) => {
    return accumulator + value
  }, 0)
  const benefitsAverage = totalBenefits / totalPopulation
  return benefitsAverage
}

console.log(
  `Moyenne du nombre d'aides par individu : ${Math.floor(
    computeBenefitsAverage()
  )}`
)
