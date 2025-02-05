import { expect } from "vitest"
import { getChapters } from "@lib/state/index.js"
import { StepStrict } from "@lib/types/steps.d.js"
import { ChapterState } from "@lib/enums/chapter.js"

describe("chapter", function () {
  const currentPath = "/path/to/some/page"
  const journey = [
    { isActive: true, path: "/path/to/some/page", chapter: "profil" },
    { isActive: false, path: "/path/to/another/page", chapter: "foyer" },
    { isActive: true, path: "/path/to/yet/another/page", chapter: "logement" },
    {
      isActive: true,
      path: "/path/to/yet/another/page/again",
      chapter: "revenus",
    },
  ] as StepStrict[]

  function mockChaptersWithStates(profilState, logementState, revenusState) {
    return [
      {
        label: "Mon profil",
        name: "profil",
        state: profilState,
        root: "/path/to/some/page",
      },
      {
        label: "Mon logement",
        name: "logement",
        state: logementState,
        root: "/path/to/yet/another/page",
      },
      {
        label: "Mes revenus",
        name: "revenus",
        state: revenusState,
        root: "/path/to/yet/another/page/again",
      },
    ]
  }

  it("returns the active with corresponding states", function () {
    expect(getChapters(currentPath, journey)).toEqual(
      mockChaptersWithStates(
        ChapterState.Current,
        ChapterState.Pending,
        ChapterState.Pending
      )
    )
  })

  describe("when currentPath is at more advanced step", function () {
    const currentPath = "/path/to/yet/another/page"

    it("returns the active with corresponding states", function () {
      expect(getChapters(currentPath, journey)).toEqual(
        mockChaptersWithStates(
          ChapterState.Done,
          ChapterState.Current,
          ChapterState.Pending
        )
      )
    })
  })

  describe("when currentPath is not in journey", function () {
    const currentPath = "/path/to/unknown/page"

    it("returns the active with corresponding states", function () {
      expect(getChapters(currentPath, journey)).toEqual(
        mockChaptersWithStates(
          ChapterState.Done,
          ChapterState.Done,
          ChapterState.Done
        )
      )
    })

    describe("when lastUnansweredStep is provided", function () {
      const lastUnansweredStep = "/path/to/yet/another/page"

      it("returns the active with corresponding states", function () {
        expect(getChapters(currentPath, journey, lastUnansweredStep)).toEqual(
          mockChaptersWithStates(
            ChapterState.Done,
            ChapterState.Current,
            ChapterState.Pending
          )
        )
      })
    })
  })
})
