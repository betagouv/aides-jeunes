const { generateBlocks } = require("../lib/state/blocks")

const getStepOrSubSteps = (accum, step) => {
  if (step.steps) {
    return getStepOrSubSteps(accum, step.steps)
  } else if (step.length) {
    step.forEach((s) => {
      getStepOrSubSteps(accum, s)
    })
    return accum
  }
  accum.push(step)

  return accum
}

const emptySimulation = {
  individus: {
    demandeur: {},
  },
  menage: {},
}

const steps = generateBlocks(emptySimulation)

const result = []
getStepOrSubSteps(result, steps)
console.log(result)
