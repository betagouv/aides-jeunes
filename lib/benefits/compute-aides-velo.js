import aidesVelo from 'aides-velo'
import Institution from '@/lib/Institution'

function computeAidesVeloBenefits(resultHolder, situation, openfiscaResponse) {

  console.log(situation)

  const inputs = {
    "vélo . type": "électrique",
    "localisation . code insee": situation.menage.depcom,
    // "localisation . epci": "CA Colmar Agglomération",
    "localisation . département": situation.menage._departement,
    "localisation . région": situation.menage._region,
    }

  const results = aidesVelo(inputs).reduce((a, v) => {
    a[v.title] = v
    return a
  }, {})

  console.log(inputs, results)

  Institution.benefits.all
    .filter((benefit) => benefit.source === "aides-velo")
    .filter((benefit) => results[benefit.titre])
    .forEach((benefit) => {
      resultHolder.push({
        ...benefit,
        ...results[benefit.titre]
      })
    })
  console.log(JSON.stringify(resultHolder, null, 2))
}

const aidesVeloCompute = {
  computeAidesVeloBenefits
}

export default aidesVeloCompute
