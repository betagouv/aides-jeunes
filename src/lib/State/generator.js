var { Step } = require("./steps")
var { generateBlocks } = require("./blocks")

function processBlock({ journey, answers, isActive }, block) {
  if (block instanceof Step) {
    block.isActive = isActive
    journey.push(block)
  } else if (typeof block == "string") {
    console.warn(`string step should no longer be used: ${block}`)
    journey.push({ isActive, path: block })
  } else {
    if (!block.steps) {
      throw Error(`${block} (${block instanceof Array ? "array" : "?"})`)
    }
    const localActive = isActive && block.isActive
    block.steps.forEach((step) =>
      processBlock(
        {
          journey,
          answers,
          isActive: localActive,
        },
        step
      )
    )
  }
}

function generateJourney(answers, parameters) {
  const blocks = generateBlocks(answers, parameters)

  function processBlocks({ answers, parameters }) {
    let journey = []
    blocks.forEach((b) => {
      processBlock({ journey, answers, isActive: true, parameters }, b)
    })
    return journey
  }
  try {
    return processBlocks({ answers, parameters })
  } catch (e) {
    console.log("error", e)
  }
}

function generateAllSteps(answers, parameters) {
  const fullSteps = generateJourney(answers, parameters)
  fullSteps.pop()
  let lastChapter
  return fullSteps.map((s) => {
    if (s.chapter) lastChapter = s.chapter
    else s.chapter = lastChapter
    return s
  })
}

module.exports = {
  generateAllSteps,
}
