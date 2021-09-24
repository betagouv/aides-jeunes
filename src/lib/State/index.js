var { generateBlocks } = require("./blocks")
var { Step } = require("./steps")
var Chapters = require("../Chapters")

function processBlock({ journey, subject, situation, isActive }, block) {
  if (block instanceof Step) {
    block.isActive = isActive
    journey.push(block)
  } else if (typeof block == "string") {
    console.warn(`string step should no longer be used: ${block}`)
    journey.push({ isActive, path: block })
  } else {
    if (!block.steps) {
      throw Error(
        "" + block + " (" + (block instanceof Array ? "array" : "?") + ")"
      )
    }
    let blockSubject = block.subject
      ? block.subject(subject, situation)
      : subject || situation
    const localActive =
      isActive &&
      (!block.isActive ||
        (blockSubject && block.isActive(blockSubject, situation)))
    block.steps.forEach((s) =>
      processBlock(
        { journey, subject: blockSubject, situation, isActive: localActive },
        s
      )
    )
  }
}

function generateJourney(situation) {
  const blocks = generateBlocks(situation)

  try {
    let journey = []
    blocks.forEach((b) => {
      processBlock(
        { journey, subject: situation, situation, isActive: true },
        b
      )
    })
    return journey
  } catch (e) {
    console.log("error", e)
  }
}

function full(situation) {
  const journey = generateJourney(situation)
  journey.pop()
  let lastChapter
  journey.forEach((s) => {
    if (s.chapter) lastChapter = s.chapter
    else s.chapter = lastChapter
  })
  return journey
}

function chapters(currentPath, situation, userJourney) {
  const cleanPath = currentPath
    .replace(/\/sommaire$/, "")
    .replace(/\/en_savoir_plus$/, "")
  const journey = full(situation)
  const activeJourney = journey.filter((s) => s.isActive)
  const activeChaptersNames = activeJourney
    .map((c) => c.chapter)
    .filter((value, index, self) => self.indexOf(value) === index)
  const currentStep = journey.find((item) => item.path == cleanPath)
  const activeChapters = Chapters.default
    .getSommaireChapters()
    .filter((c) => activeChaptersNames.includes(c.name))
  const maxStep = max(situation, userJourney)
  let passedChapter = true
  return activeChapters.map((chapter) => {
    passedChapter =
      chapter.name === (maxStep && maxStep.chapter) ? false : passedChapter
    chapter.done = passedChapter
    chapter.current = chapter.name === (currentStep && currentStep.chapter)
    return chapter
  })
}

function chapterRoot(chapter, situation) {
  const journey = full(situation)
  const activeJourney = journey.filter((s) => s.isActive)
  return activeJourney.find((item) => item.chapter == chapter)
}

function current(currentPath, situation) {
  const journey = full(situation)
  return journey.find((item) => item.path == currentPath)
}

function max(situation, userJourney) {
  const journey = full(situation)
  const activeJourney = journey.filter((s) => s.isActive)
  return activeJourney.find((s) => !userJourney.doneHistory.includes(s.path))
}

function next(current, situation) {
  const journey = full(situation)
  let matches = journey
    .map((element, index) => {
      return { element, index }
    })
    .filter((item) => item.element.path === (current.path || current))

  if (!matches.length) {
    const test = current.path || current
    throw new Error("Logic missing for " + test)
  }

  return journey
    .slice(matches[matches.length - 1].index + 1)
    .filter((step) => step.isActive)[0]
}

function previous(current, situation) {
  const journey = full(situation)

  let matches = journey
    .map((element, index) => {
      return { element, index }
    })
    .filter((item) => item.element.path === (current.path || current))

  if (!matches.length) {
    const test = current.path || current
    throw new Error("Logic missing for " + test)
  }

  const activeJourney = journey
    .slice(0, matches[matches.length - 1].index)
    .filter((s) => s.isActive)
  return activeJourney[activeJourney.length - 1]
}

module.exports = {
  full,
  next,
  chapters,
  chapterRoot,
  current,
  previous,
  max,
}
