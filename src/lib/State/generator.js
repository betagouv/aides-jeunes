var { Step } = require("./steps")
var { generateBlocks } = require("./blocks")

function processBlock(
  { journey, subject, situation, isActive, parameters },
  b
) {
  if (b instanceof Step) {
    b.isActive = isActive
    journey.push(b)
  } else if (typeof b == "string") {
    console.warn(`string step should no longer be used: ${b}`)
    journey.push({ isActive, path: b })
  } else {
    if (!b.steps) {
      throw Error("" + b + " (" + (b instanceof Array ? "array" : "?") + ")")
    }
    let blockSubject = b.subject
      ? b.subject(subject, situation)
      : subject || situation
    const localActive =
      isActive &&
      (!b.isActive ||
        (blockSubject && b.isActive(blockSubject, situation, parameters)))
    b.steps.forEach((s) =>
      processBlock(
        {
          journey,
          subject: blockSubject,
          situation,
          parameters,
          isActive: localActive,
        },
        s
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
