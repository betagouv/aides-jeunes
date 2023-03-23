import Chapters from "../chapters.js"
import { ChapterState } from "@lib/enums/chapter"

export function chapters(currentPath, journey, lastUnanswerPath?) {
  const activeJourney = journey.filter((step) => step.isActive)
  const currentStep = getCurrentStep(currentPath, journey, lastUnanswerPath)

  let chapters = getActiveChapters(activeJourney)
  chapters = computeChapterState(chapters, currentStep)
  chapters = setChapterRootPath(chapters, activeJourney)

  return chapters
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

function getCurrentStep(currentPath, journey, lastUnanswerPath) {
  const cleanPath = currentPath.replace(/\/en_savoir_plus$/, "")
  const currentStep =
    journey.find((step) => step.path == cleanPath) ||
    journey.find((step) => step.path === lastUnanswerPath)

  return currentStep
}

function getActiveChapters(activeJourney) {
  const activeChaptersNames = activeJourney
    .map((step) => step.chapter)
    .filter((chapter, index, self) => self.indexOf(chapter) === index)

  return Chapters.getSommaireChapters().filter((chapter) =>
    activeChaptersNames.includes(chapter.name)
  )
}

function setChapterRootPath(chapters, journey) {
  return chapters.map((chapter) => {
    chapter.root = journey.find((step) => step.chapter == chapter.name).path
    return chapter
  })
}

function computeChapterState(chapters: chapterLayout[], currentStep): chapterLayout[] {
  let isCurrentChapter
  let passedChapter = false
  return chapters.map((chapter) => {
    isCurrentChapter = chapter.name === currentStep?.chapter

    if (isCurrentChapter) {
      chapter.state = ChapterState.current
      passedChapter = true
    } else if (passedChapter) {
      chapter.state = ChapterState.pending
    } else {
      chapter.state = ChapterState.done
    }

    return chapter
  })
}
