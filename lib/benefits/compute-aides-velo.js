const { generator } = require("../Dates")
const aidesVelo = require("aides-velo")

function computeAidesVeloBenefits(
  aidesVeloBenefitList,
  resultHolder,
  situation,
  openfiscaResponse
) {
  const periods = generator(situation.dateDeValeur)

  const inputs = {
    "vélo . type": "électrique",
    "localisation . code insee": situation.menage.depcom,
    "localisation . epci": situation.menage._epci,
    "localisation . département": situation.menage._departement,
    "localisation . région": situation.menage._region,
  }
  inputs["revenu fiscal de référence"] =
    openfiscaResponse?.foyers_fiscaux?._?.rfr[periods.fiscalYear.id] || 0

  const eligibleBenefitsMap = aidesVelo(inputs).reduce((a, v) => {
    a[v.id] = {
      ...v,
      montant: v.amount,
      link: v.url,
    }
    return a
  }, {})

  aidesVeloBenefitList
    .filter((benefit) => eligibleBenefitsMap[benefit.id])
    .forEach((benefit) => {
      resultHolder.push({
        ...benefit,
        ...eligibleBenefitsMap[benefit.id],
      })
    })
}

exports.computeAidesVeloBenefits = computeAidesVeloBenefits
