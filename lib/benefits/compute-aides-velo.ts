import { AidesVeloEngine, Questions } from "@betagouv/aides-velo"
import { datesGenerator } from "../dates.js"
import { Velo } from "../enums/velo.js"
import { Situation } from "../types/situations.js"
import IndividuMethods from "../individu.js"
import { Activite } from "../enums/activite.js"
import { StandardBenefit } from "@data/types/benefits.js"

const veloTypes: Record<Velo, Questions["vélo . type"]> = {
  [Velo.VeloMecanique]: "mécanique simple",
  [Velo.VeloElectrique]: "électrique",
  [Velo.VeloCargo]: "cargo",
  [Velo.VeloCargoElectrique]: "cargo électrique",
  [Velo.VeloPliant]: "pliant",
  [Velo.VeloPliantElectrique]: "pliant électrique",
  [Velo.VeloMotorisation]: "motorisation",
  [Velo.VeloAdapte]: "adapté",
}

export const aidesVeloEngine = new AidesVeloEngine()

function isSituationEligibleForAidesVelo(situation: Situation): boolean {
  return [
    situation.menage.depcom,
    situation.menage._departement,
    situation.menage._region,
  ].every(Boolean)
}

export function computeAidesVeloBenefits(
  aidesVeloBenefitList: StandardBenefit[],
  resultBenefitsList: StandardBenefit[] | null,
  situation: Situation,
  openfiscaResponse,
) {
  if (!isSituationEligibleForAidesVelo(situation)) return

  const periods = datesGenerator(situation.dateDeValeur)
  const age = IndividuMethods.age(situation.demandeur, periods.today.value)
  const eligibleBenefitsMap = {}

  for (const type of situation.demandeur._interetsAidesVelo ?? []) {
    const inputs: Questions = {
      "vélo . type": veloTypes[type],
      "localisation . code insee": situation.menage.depcom,
      "localisation . epci": situation.menage._epci,
      "localisation . département": situation.menage._departement,
      "localisation . région": situation.menage._region,
      "revenu fiscal de référence par part . revenu de référence":
        // NOTE: est-ce que c'est le revenu fiscal de référence par part ou le revenu fiscal de référence ?
        openfiscaResponse.foyers_fiscaux._.rfr[periods.fiscalYear.id],
      "demandeur . en situation de handicap": situation.demandeur.handicap,
      "demandeur . âge": age,
      ...mapActiviteToQuestions(situation.demandeur.activite),
    }

    Object.assign(
      eligibleBenefitsMap,
      aidesVeloEngine
        .shallowCopy()
        .setInputs(inputs)
        .computeAides()
        .reduce((acc, current) => {
          acc[current.id] = {
            ...current,
            montant: current.amount,
            link: current.url,
          }
          return acc
        }, {}),
    )
  }

  aidesVeloBenefitList
    .filter((benefit) => eligibleBenefitsMap[benefit.external_id])
    .forEach((benefit) => {
      resultBenefitsList?.push({
        ...benefit,
        ...eligibleBenefitsMap[benefit.external_id],
        id: benefit.id,
      })
    })
}

function mapActiviteToQuestions(activite: Activite | undefined): Questions {
  switch (activite) {
    case Activite.Apprenti:
      return { "demandeur . statut": "apprenti" }
    case Activite.BeneficiaireRsa:
      return { "demandeur . bénéficiaire du RSA": true }
    case Activite.Chomeur:
      return { "demandeur . statut": "demandeur d'emploi" }
    case Activite.Etudiant:
      return { "demandeur . statut": "étudiant" }
    case Activite.Salarie:
    case Activite.Independant:
      return { "demandeur . statut": "salarié" }
    case Activite.Retraite:
      return { "demandeur . statut": "retraité" }
    case Activite.SituationHandicap:
      return { "demandeur . en situation de handicap": true }
    default:
      return {}
  }
}
