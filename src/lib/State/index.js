const Chapters = require("../Chapters")

function chapters(currentPath, journey) {
  const cleanPath = currentPath.replace(/\/en_savoir_plus$/, "")
  const activeJourney = journey.filter((s) => s.isActive)
  const activeChaptersNames = activeJourney
    .map((c) => c.chapter)
    .filter((value, index, self) => self.indexOf(value) === index)
  const currentStep = journey.find((item) => item.path == cleanPath)
  const activeChapters = Chapters.default
    .getSommaireChapters()
    .filter((c) => activeChaptersNames.includes(c.name))
  let isCurrentChapter
  let passedChapter = true
  return activeChapters.map((chapter) => {
    isCurrentChapter = chapter.name === (currentStep && currentStep.chapter)
    passedChapter = isCurrentChapter ? false : passedChapter
    chapter.done = passedChapter
    chapter.current = isCurrentChapter
    chapter.root = activeJourney.find(
      (item) => item.chapter == chapter.name
    ).path
    return chapter
  })
}

function current(currentPath, journey) {
  return journey.find((item) => item.path == currentPath)
}

function next(current, journey) {
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

module.exports = {
  next,
  chapters,
  current,
}
