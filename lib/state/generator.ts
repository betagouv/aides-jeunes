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

function generateJourney(situation, parameters): StepLayout[] | undefined {
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
