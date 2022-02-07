const { generateBlocks } = require("../lib/state/blocks")

const emptySimulation = {
  individus: {
    demandeur: {},
  },
  menage: {},
}
console.log(generateBlocks(emptySimulation))
