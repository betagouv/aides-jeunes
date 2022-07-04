const { getParametersSync } = require("../lib/openfisca/parameters")
const { generator } = require("../../lib/dates")
const { generateSituation } = require("../../lib/situations")
const { ENTITIES_PROPERTIES } = require("../../lib/mutualized-steps")
const SimpleProperties = require("../../lib/properties/others/simple-properties")
const Individu = require("../../lib/individu")
const { generateAllSteps } = require("../../lib/state/generator")
const ComplexeProperties = require("../../lib/properties/others/complexe-properties")
const { ressourceTypes } = require("../../lib/resources")
const DepcomProperties = require("../../lib/properties/depcom-properties")

const COMPLEXE_STEPS = Object.values(ComplexeProperties.default)

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
    ],
  },
}

function getSituationIndividus(situation) {
  return []
    .concat(situation.demandeur, situation.conjoint, situation.enfants)
    .filter((individu) => individu)
}

function getQuestionsPerStep(step, propertyData, individus) {
  let result = {
    id: step.variable,
    entity: step.entity,
    individu: step.id,
    url: step.path,
  }

  const property =
    ENTITIES_PROPERTIES[step.entity]?.[step.variable] ||
    DepcomProperties.default[step.variable] ||
    SimpleProperties.default[step.variable]

  const individu = Individu.getById(individus, step.id)

  if (property) {
    const currentPropertyData = {
      ...propertyData,
      individu,
    }
    result = {
      ...result,
      questionFormat: property.getFormat(currentPropertyData),
    }
    return result
  }
  const complexeStep = COMPLEXE_STEPS.find((complexeStep) =>
    complexeStep.matcher(step)
  )
  if (complexeStep) {
    const formatResult = complexeStep.getFormat(step, propertyData, individus)
    const questionFormatName = Array.isArray(formatResult)
      ? "questionsFormat"
      : "questionFormat"
    return {
      ...result,
      [questionFormatName]: formatResult,
    }
  }

  return {
    ...result,
    missing: true,
  }
}

exports.getQuestions = (req, res) => {
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
  const result = steps.reduce(
    (accum, step) => [
      ...accum,
      getQuestionsPerStep(step, propertyData, individus),
    ],
    []
  )

  return res.send(result)
}
