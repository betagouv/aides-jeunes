import Chapters from "../chapters.js"
import { chapterLayout } from "@lib/types/chapters.d"
import { StepLayout } from "@lib/types/steps.d.js"
import { RouteLayout } from "@lib/types/route.d.js"
import { ChapterState } from "../enums/chapter.js"

export function getChapters(
  currentPath: string,
  journey: StepLayout[],
  lastUnanswerPath?: string
): chapterLayout[] {
  const activeJourney = journey.filter((step) => step.isActive)
  const currentStep = getCurrentStep(currentPath, journey, lastUnanswerPath)

  let chapters: chapterLayout[] = getActiveChapters(activeJourney)
  chapters = computeChapterState(chapters, currentStep)
  chapters = setChapterRootPath(chapters, activeJourney)

  return chapters
}

export function current(
  currentPath: string,
  journey: StepLayout[]
): StepLayout | undefined {
  return journey.find((item) => item.path == currentPath)
}

export function getNextStep(
  currentRoute: RouteLayout,
  journey: StepLayout[]
): StepLayout {
  const matches = journey
    .map((element, index) => {
      return { element, index }
    })
    .filter((item) => item.element.path == (currentRoute.path || current))

  if (!matches.length) {
    const test = currentRoute.path || currentRoute.fullPath || current
    throw new Error(`Logic missing for ${test}`)
  }
  return journey
    .slice(matches[matches.length - 1].index + 1)
    .filter((step) => step.isActive)[0]
}

function getCurrentStep(
  currentPath: string,
  journey: StepLayout[],
  lastUnanswerPath: string | undefined
): StepLayout | undefined {
  const cleanPath = currentPath.replace(/\/en_savoir_plus$/, "")
  const currentStep =
    journey.find((step) => step.path == cleanPath) ||
    journey.find((step) => step.path === lastUnanswerPath)

  return currentStep
}

function getActiveChapters(activeJourney: StepLayout[]): chapterLayout[] {
  const activeChaptersNames = activeJourney
    .map((step) => step.chapter)
    .filter((chapter, index, self) => self.indexOf(chapter) === index)

  return Chapters.getSommaireChapters().filter((chapter) =>
    activeChaptersNames.includes(chapter.name)
  )
}

function setChapterRootPath(
  chapters: chapterLayout[],
  journey: StepLayout[]
): chapterLayout[] {
  return chapters.map((chapter) => {
    chapter.root = journey.find((step) => step.chapter == chapter.name)?.path
    return chapter
  })
}

function computeChapterState(
  chapters: chapterLayout[],
  currentStep: StepLayout | undefined
): chapterLayout[] {
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
