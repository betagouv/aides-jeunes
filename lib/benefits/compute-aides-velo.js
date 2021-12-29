const { generator } = require("../Dates")
const aidesVelo = require("aides-velo")
const aidesVeloBenefitList = require("../../data/benefits/aides-velo")
const epci = require("@etalab/decoupage-administratif/data/epci.json")

function computeAidesVeloBenefits(resultHolder, situation, openfiscaResponse) {
  const periods = generator(situation.dateDeValeur)

  const epciMatch = epci.filter(
    (e) => situation.menage._epci && e.code === situation.menage._epci
  )
  const epciValue = epciMatch.length && epciMatch[0].nom

  const inputs = {
    "vélo . type": "électrique",
    "localisation . code insee": situation.menage.depcom,
    "localisation . epci": epciValue,
    "localisation . département": situation.menage._departement,
    "localisation . région": situation.menage._region,
  }
  if (
    openfiscaResponse &&
    openfiscaResponse.foyers_fiscaux &&
    openfiscaResponse.foyers_fiscaux._.rfr
  ) {
    inputs["revenu fiscal de référence"] =
      openfiscaResponse.foyers_fiscaux._.rfr[periods.fiscalYear.id] || 0
  }

  const eligibleBenefitsMap = aidesVelo(inputs).reduce((a, v) => {
    a[v.title] = {
      ...v,
      montant: v.amount,
      link: v.url,
    }
    return a
  }, {})

  aidesVeloBenefitList
    .filter((benefit) => eligibleBenefitsMap[benefit.titre])
    .forEach((benefit) => {
      resultHolder.push({
        ...benefit,
        ...eligibleBenefitsMap[benefit.titre],
      })
    })
}

exports.computeAidesVeloBenefits = computeAidesVeloBenefits
