import aidesVelo from "aides-velo"
import Institution from "@/lib/Institution"

function computeAidesVeloBenefits(resultHolder, situation, openfiscaResponse) {
  const inputs = {
    "vélo . type": "électrique",
    "localisation . code insee": situation.menage.depcom,
    // "localisation . epci": "CA Colmar Agglomération",
    "localisation . département": situation.menage._departement,
    "localisation . région": situation.menage._region,
  }

  const eligibleBenefitsMap = aidesVelo(inputs).reduce((a, v) => {
    a[v.title] = v
    return a
  }, {})

  Institution.benefits.all
    .filter((benefit) => benefit.source === "aides-velo")
    .filter((benefit) => eligibleBenefitsMap[benefit.titre])
    .forEach((benefit) => {
      resultHolder.push({
        ...benefit,
        ...eligibleBenefitsMap[benefit.titre],
      })
    })
}

const aidesVeloCompute = {
  computeAidesVeloBenefits,
}

export default aidesVeloCompute
