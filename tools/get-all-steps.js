const { generateBlocks } = require("../lib/state/blocks")

const getStepOrSubSteps = (accum, step) => {
  if (step.steps) {
    return step.steps.reduce((accumI, substep) => {
      return getStepOrSubSteps(accumI, substep)
    }, accum)
  } else {
    accum.push(step)
    return accum
  }
}

const emptySimulation = {
  individus: {
    demandeur: {},
  },
  menage: {},
}

const steps = generateBlocks(emptySimulation)
const result = getStepOrSubSteps([], { steps })
console.log(JSON.stringify(result, null, 2))
