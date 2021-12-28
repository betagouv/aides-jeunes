import aidesVelo from "aides-velo"
import aidesVeloBenefitList from "@/../data/benefits/aides-velo"
import epci from "@etalab/decoupage-administratif/data/epci.json"

function computeAidesVeloBenefits(resultHolder, situation, openfiscaResponse) {
  const epciMatch = epci.filter((e) => e.code === situation.menage._epci)
  const epciValue = epciMatch.length && epciMatch[0].nom

  const inputs = {
    "vélo . type": "électrique",
    "localisation . code insee": situation.menage.depcom,
    "localisation . epci": epciValue,
    "localisation . département": situation.menage._departement,
    "localisation . région": situation.menage._region,
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
