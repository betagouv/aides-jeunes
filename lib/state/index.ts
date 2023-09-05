import Chapters from "../chapters.js"
import { Chapter } from "@lib/types/chapters.d"
import { StepStrict } from "@lib/types/steps.d.js"
import { Route } from "@lib/types/route.d.js"
import { ChapterState } from "../enums/chapter.js"

export function getChapters(
  currentPath: string,
  journey: StepStrict[],
  lastUnanswerPath?: string
): Chapter[] {
  const activeJourney = journey.filter((step) => step.isActive)
  const currentStep = getCurrentStep(currentPath, journey, lastUnanswerPath)

  let chapters: Chapter[] = getActiveChapters(activeJourney)
  chapters = computeChapterState(chapters, currentStep)
  chapters = setChapterRootPath(chapters, activeJourney)

  return chapters
}

export function current(
  currentPath: string,
  journey: StepStrict[]
): StepStrict | undefined {
  return journey.find((item) => item.path == currentPath)
}

export function getNextStep(
  currentRoute: Route,
  journey: StepStrict[]
): StepStrict {
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
  journey: StepStrict[],
  lastUnanswerPath: string | undefined
): StepStrict | undefined {
  const cleanPath = currentPath.replace(/\/en_savoir_plus$/, "")
  const currentStep =
    journey.find((step) => step.path == cleanPath) ||
    journey.find((step) => step.path === lastUnanswerPath)

  return currentStep
}

function getActiveChapters(activeJourney: StepStrict[]): Chapter[] {
  const activeChaptersNames = activeJourney
    .map((step) => step.chapter)
    .filter((chapter, index, self) => self.indexOf(chapter) === index)

  return Chapters.getSommaireChapters().filter((chapter) =>
    activeChaptersNames.includes(chapter.name)
  )
}

function setChapterRootPath(
  chapters: Chapter[],
  journey: StepStrict[]
): Chapter[] {
  return chapters.map((chapter) => {
    chapter.root = journey.find((step) => step.chapter == chapter.name)?.path
    return chapter
  })
}

function computeChapterState(
  chapters: Chapter[],
  currentStep: StepStrict | undefined
): Chapter[] {
  let isCurrentChapter
  let passedChapter = false
  return chapters.map((chapter) => {
    isCurrentChapter = chapter.name === currentStep?.chapter

    if (isCurrentChapter) {
      chapter.state = ChapterState.Current
      passedChapter = true
    } else if (passedChapter) {
      chapter.state = ChapterState.Pending
    } else {
      chapter.state = ChapterState.Done
    }

    return chapter
  })
}
