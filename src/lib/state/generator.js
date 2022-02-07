const { Step } = require("./steps")
const { generateBlocks } = require("./blocks")

function processBlock(
  { journey, subject, situation, isActive, parameters },
  block
) {
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
    let blockSubject = block.subject
      ? block.subject(subject, situation)
      : subject || situation
    const localActive =
      isActive &&
      (!block.isActive ||
        (blockSubject && block.isActive(blockSubject, situation, parameters)))
    block.steps.forEach((step) =>
      processBlock(
        {
          journey,
          subject: blockSubject,
          situation,
          parameters,
          isActive: localActive,
        },
        step
      )
    )
  }
}

function generateJourney(situation, parameters) {
  const blocks = generateBlocks(situation)

  function processBlocks({ situation, parameters }) {
    let journey = []
    blocks.forEach((b) => {
      processBlock(
        { journey, subject: situation, situation, isActive: true, parameters },
        b
      )
    })
    return journey
  }
  try {
    return processBlocks({ situation, parameters })
  } catch (e) {
    console.log("error", e)
  }
}

function generateAllSteps(situation, parameters) {
  const fullSteps = generateJourney(situation, parameters)
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
