var { generateBlocks } = require("./blocks")
var { Step } = require("./steps")
var Chapters = require("../Chapters")

function processBlock({ journey, subject, situation, isActive }, b) {
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
      (!b.isActive || (blockSubject && b.isActive(blockSubject, situation)))
    b.steps.forEach((s) =>
      processBlock(
        { journey, subject: blockSubject, situation, isActive: localActive },
        s
      )
    )
  }
}

function generateJourney(situation) {
  const blocks = generateBlocks(situation)

  function processBlocks({ situation }) {
    let journey = []
    blocks.forEach((b) => {
      processBlock(
        { journey, subject: situation, situation, isActive: true },
        b
      )
    })
    return journey
  }
  try {
    return processBlocks({ situation })
  } catch (e) {
    console.log("error", e)
  }
}

function full(situation) {
  const journey = generateJourney(situation)
  journey.pop()
  let lastChapter
  return journey.map((s) => {
    if (s.chapter) lastChapter = s.chapter
    else s.chapter = lastChapter
    return s
  })
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
    .filter((item) => item.element.path == (current.path || current))

  if (!matches.length) {
    const test = current.path || current.fullPath || current
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
    .filter((item) => item.element.path == (current.path || current))

  if (!matches.length) {
    const test = current.path || current.fullPath || current
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
