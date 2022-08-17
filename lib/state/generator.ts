import { Step } from "./steps.js"
import { generateBlocks } from "./blocks.js"
import { StepLayout } from "../types/steps"

import { BlockLayout } from "../types/blocks.js"

function processBlock(
  { journey, subject, situation, isActive, parameters },
  block: BlockLayout
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
    const blockSubject = block.subject
      ? block.subject(subject, situation)
      : subject || situation
    const localActive =
      isActive &&
      (!block.isActive ||
        (blockSubject && block.isActive(blockSubject, situation, parameters)))
    block.steps.forEach((step) =>
      processBlock(
        {
          isActive: localActive,
          journey,
          parameters,
          situation,
          subject: blockSubject,
        },
        step
      )
    )
  }
}

function generateJourney(situation, parameters): StepLayout[] | undefined {
  const blocks = generateBlocks(situation)

  function processBlocks({ situation, parameters }) {
    const journey = []
    blocks.forEach((b) => {
      processBlock(
        { isActive: true, journey, parameters, situation, subject: situation },
        b
      )
    })
    return journey
  }
  try {
    return processBlocks({ parameters, situation })
  } catch (e) {
    console.log("error", e)
  }
}

export function generateAllSteps(situation, parameters) {
  const fullSteps = generateJourney(situation, parameters)
  if (!fullSteps) return []
  fullSteps.pop()
  let lastChapter
  return fullSteps.map((s) => {
    if (s.chapter) lastChapter = s.chapter
    else s.chapter = lastChapter
    return s
  })
}
