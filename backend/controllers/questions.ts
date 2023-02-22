import { getParametersSync } from "../lib/openfisca/parameters.js"
import { generator } from "../../lib/dates.js"
import { generateSituation } from "../../lib/situations.js"
import Individu from "../../lib/individu.js"
import { generateAllSteps } from "../../lib/state/generator.js"
import { ressourceTypes } from "../../lib/resources.js"
import SimpleProperties from "../../lib/properties/others/simple-properties.js"
import ComplexeProperties from "../../lib/properties/others/complexe-properties.js"
import DepcomProperties from "../../lib/properties/depcom-properties.js"
import { ENTITIES_PROPERTIES } from "../../lib/mutualized-steps.js"

import { questionLayout } from "../types/question.js"

const COMPLEXE_STEPS = Object.values(ComplexeProperties)

const simulationBase = {
  enfants: [0],
  answers: {
    all: [
      {
        entityName: "individu",
        fieldName: "date_naissance",
        id: "demandeur",
        value: "1999-12-31T23:00:00.000Z",
      },
      {
        entityName: "famille",
        fieldName: "en_couple",
        value: true,
      },
      {
        entityName: "individu",
        fieldName: "date_naissance",
        id: "conjoint",
        value: "1999-12-31T23:00:00.000Z",
      },
      {
        entityName: "individu",
        fieldName: "_firstName",
        id: "enfant_0",
        value: "votre 1ᵉʳ enfant",
      },
      {
        entityName: "individu",
        fieldName: "date_naissance",
        id: "enfant_0",
        value: "2020-12-31T23:00:00.000Z",
      },
      {
        entityName: "individu",
        fieldName: "date_naissance",
        id: "enfant_0",
        value: "1999-12-31T23:00:00.000Z",
      },
      {
        entityName: "individu",
        fieldName: "enfant_a_charge",
        id: "demandeur",
        value: true,
      },
      {
        entityName: "parents",
        fieldName: "_situation",
        value: "en_couple",
      },
      {
        id: "demandeur",
        entityName: "individu",
        fieldName: "ressources",
        value: ressourceTypes.map((resource) => resource.id),
      },
      {
        entityName: "individu",
        fieldName: "date_debut_chomage",
        id: "demandeur",
        value: "2021-12-31T23:00:00.000Z",
      },
      {
        entityName: "individu",
        fieldName: "date_debut_chomage",
        id: "conjoint",
        value: "2021-12-31T23:00:00.000Z",
      },
    ],
  },
}

function getSituationIndividus(situation) {
  return []
    .concat(situation.demandeur, situation.conjoint, situation.enfants)
    .filter((individu) => individu)
}

function getQuestionsPerStep(
  step,
  propertyData,
  individus
): questionLayout | undefined {
  const result: questionLayout = {
    id: step.variable,
    entity: step.entity,
    individu: step.id,
    url: step.path,
  }

  const property =
    ENTITIES_PROPERTIES[step.entity]?.[step.variable] ||
    DepcomProperties[step.variable] ||
    SimpleProperties[step.variable]

  const individu = Individu.getById(individus, step.id)

  if (property) {
    const currentPropertyData = {
      ...propertyData,
      individu,
    }
    return {
      ...result,
      questionFormat: property.getFormat(currentPropertyData),
    }
  }
  const complexeStep = COMPLEXE_STEPS.find((complexeStep) =>
    complexeStep.matcher(step)
  )
  if (complexeStep && complexeStep.getFormat) {
    const formatResult = complexeStep.getFormat(step, propertyData, individus)
    const questionFormatName = Array.isArray(formatResult)
      ? "questionsFormat"
      : "questionFormat"
    return {
      ...result,
      [questionFormatName]: formatResult,
    }
  }
}

export function getQuestions(req, res) {
  const simulation = {
    ...simulationBase,
    dateDeValeur: Date.now(),
  }
  const situation = generateSituation(simulation, true)
  const periods = generator(simulation.dateDeValeur)

  const individus = getSituationIndividus(situation)

  const now = Date.now()
  const propertyData = {
    openFiscaParameters: getParametersSync(now),
    simulation,
    periods,
  }

  const steps = generateAllSteps(situation, propertyData.openFiscaParameters)
  const result = steps.reduce((accum: any[], step) => {
    const question = getQuestionsPerStep(step, propertyData, individus)
    if (question) {
      accum.push(question)
    }
    return accum
  }, [])

  return res.send(result)
}
