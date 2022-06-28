const { getParametersSync } = require("../lib/openfisca/parameters")
const { generator } = require("../../lib/dates")
const { generateSituation } = require("../../lib/situations")
const { ENTITIES_PROPERTIES } = require("../../lib/mutualized-steps")
const SimpleProperties = require("../../lib/properties/others/simple-properties")
const Individu = require("../../lib/individu")
const { generateAllSteps } = require("../../lib/state/generator")

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
    ],
  },
}

function getSituationIndividus(situation) {
  return []
    .concat(situation.demandeur, situation.conjoint, situation.enfants)
    .filter((individu) => individu)
}

function getIndividu(individus, individuId) {
  let individu
  if (individuId) {
    const role = individuId.split("_")[0]
    individu = Individu.get(individus, role, individuId).individu
  }
  return individu
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
    SimpleProperties.default[step.variable]

  if (property) {
    const individu = getIndividu(individus, step.id)

    const currentPropertyData = {
      ...propertyData,
      individu,
    }
    result = { ...result, ...property.getFormat(currentPropertyData) }
    return [result]
  }
  return [
    {
      ...result,
      missing: true,
    },
  ]
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
      ...getQuestionsPerStep(step, propertyData, individus),
    ],
    []
  )

  return res.send(result)
}
