import Chapters from "../chapters.js"

export function chapters(currentPath, journey, lastUnanswerPath?) {
  const cleanPath = currentPath.replace(/\/en_savoir_plus$/, "")
  const activeJourney = journey.filter((s) => s.isActive)
  const activeChaptersNames = activeJourney
    .map((c) => c.chapter)
    .filter((value, index, self) => self.indexOf(value) === index)
  const currentStep =
    journey.find((item) => item.path == cleanPath) ||
    journey.find((item) => item.path === lastUnanswerPath)
  let activeChapters = Chapters.getSommaireChapters().filter((c) =>
    activeChaptersNames.includes(c.name)
  )

  activeChapters = computeChapterState(activeChapters, currentStep)
  activeChapters = setChapterRootPath(activeChapters, activeJourney)

  return activeChapters
}

export function current(currentPath, journey) {
  return journey.find((item) => item.path == currentPath)
}

export function next(current, journey) {
  const matches = journey
    .map((element, index) => {
      return { element, index }
    })
    .filter((item) => item.element.path == (current.path || current))

  if (!matches.length) {
    const test = current.path || current.fullPath || current
    throw new Error(`Logic missing for ${test}`)
  }
  return journey
    .slice(matches[matches.length - 1].index + 1)
    .filter((step) => step.isActive)[0]
}


function setChapterRootPath(chapters, journey) {
  return chapters.map((chapter) => {
    chapter.root = journey.find((item) => item.chapter == chapter.name).path
    return chapter
  })
}

function computeChapterState(chapters, currentStep) {
  let isCurrentChapter
  let passedChapter = false
  return chapters.map((chapter) => {
    isCurrentChapter = chapter.name === currentStep?.chapter

    if (isCurrentChapter) {
      chapter.state = "current"
      passedChapter = true
    } else if (passedChapter) {
      chapter.state = "done"
    } else {
      chapter.state = "pending"
    }

    return chapter
  })
}
