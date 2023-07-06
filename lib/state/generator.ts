import { Step } from "./steps.js"
import { generateBlocks } from "./blocks.js"
import { StepLayout, ComplexStepGeneratorLayout } from "../types/steps.js"

import { BlockLayout } from "../types/blocks.js"

function processAndAppendBlockRecursively(
  { journey, subject, situation, isActive, parameters },
  block: BlockLayout
) {
  if (block instanceof Step) {
    block.isActive = isActive
    journey.push(block)
    return
  }

  if (!block.steps) {
    throw Error(`${block} (${block instanceof Array ? "array" : "?"})`)
  }

  const blockSubject = block.subject
    ? block.subject(subject, situation)
    : subject
  const isCurrentBlockActive =
    isActive &&
    (typeof block.isActive === "undefined" ||
      block.isActive(blockSubject, situation, parameters))

  block.steps.forEach((step) =>
    processAndAppendBlockRecursively(
      {
        journey,
        subject: blockSubject,
        situation,
        isActive: isCurrentBlockActive,
        parameters,
      },
      step
    )
  )
}

function createJourneyFromBlocks(blocks, situation, parameters) {
  const journey = []
  blocks.forEach((block) => {
    processAndAppendBlockRecursively(
      { journey, subject: situation, situation, isActive: true, parameters },
      block
    )
  })
  return journey
}

function generateJourney(situation, parameters): StepLayout[] {
  const blocks = generateBlocks(situation)

  return createJourneyFromBlocks(blocks, situation, parameters)
}

function assignLastChapterToSteps(fullSteps) {
  let lastChapter
  return fullSteps.map((step) => {
    if (step.chapter) {
      lastChapter = step.chapter
    } else {
      step.chapter = lastChapter
    }

    return step
  })
}

export function generateAllSteps(
  situation,
  parameters
): (StepLayout | ComplexStepGeneratorLayout)[] {
  let fullSteps
  try {
    fullSteps = generateJourney(situation, parameters)
  } catch (error) {
    console.log("error", error)
    return []
  }

  return assignLastChapterToSteps(fullSteps)
}
