import aidesVelo from "aides-velo"
import { generator } from "../dates.js"

const veloTypes = {
  velo_cargo: "cargo",
  velo_cargo_electrique: "cargo électrique",
  velo_electrique: "électrique",
  velo_mecanique: "mécanique simple",
  velo_motorisation: "motorisation",
  velo_pliant: "pliant",
}

function canComputeAidesVeloBenefits(situation) {
  return [
    situation.menage.depcom,
    situation.menage._departement,
    situation.menage._region,
  ].every((value) => Boolean(value))
}

export function computeAidesVeloBenefits(
  aidesVeloBenefitList,
  resultHolder,
  situation,
  openfiscaResponse
) {
  if (!canComputeAidesVeloBenefits(situation)) {
    return
  }
  const periods = generator(situation.dateDeValeur)

  const eligibleBenefitsMap = {}
  for (let type of situation.demandeur._interetsAidesVelo) {
    const inputs = {
      "localisation . code insee": situation.menage.depcom,
      "localisation . département": situation.menage._departement,
      "localisation . epci": situation.menage._epci,
      "localisation . région": situation.menage._region,
      "revenu fiscal de référence":
        openfiscaResponse.foyers_fiscaux._.rfr[periods.fiscalYear.id],
      "vélo . type": veloTypes[type],
    }

    Object.assign(
      eligibleBenefitsMap,
      aidesVelo(inputs).reduce((a, v) => {
        a[v.id] = {
          ...v,
          link: v.url,
          montant: v.amount,
        }
        return a
      }, {})
    )
  }

  aidesVeloBenefitList
    .filter((benefit) => eligibleBenefitsMap[benefit.external_id])
    .forEach((benefit) => {
      resultHolder.push({
        ...benefit,
        ...eligibleBenefitsMap[benefit.external_id],
        id: benefit.id,
      })
    })
}
