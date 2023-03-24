import expect from "expect"

import { getChapters } from "@lib/state"

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
  ]

  it("returns the active with corresponding states", function () {
    expect(getChapters(currentPath, journey)).toEqual([
      {
        label: "Mon profil",
        name: "profil",
        state: "current",
        root: "/path/to/some/page",
      },
      {
        label: "Mon logement",
        name: "logement",
        state: "pending",
        root: "/path/to/yet/another/page",
      },
      {
        label: "Mes revenus",
        name: "revenus",
        state: "pending",
        root: "/path/to/yet/another/page/again",
      },
    ])
  })

  describe("when currentPath is at more advanced step", function () {
    const currentPath = "/path/to/yet/another/page"

    it("returns the active with corresponding states", function () {
      expect(getChapters(currentPath, journey)).toEqual([
        {
          label: "Mon profil",
          name: "profil",
          state: "done",
          root: "/path/to/some/page",
        },
        {
          label: "Mon logement",
          name: "logement",
          state: "current",
          root: "/path/to/yet/another/page",
        },
        {
          label: "Mes revenus",
          name: "revenus",
          state: "pending",
          root: "/path/to/yet/another/page/again",
        },
      ])
    })
  })

  describe("when currentPath is not in journey", function () {
    const currentPath = "/path/to/unknown/page"

    it("returns the active with corresponding states", function () {
      expect(getChapters(currentPath, journey)).toEqual([
        {
          label: "Mon profil",
          name: "profil",
          state: "done",
          root: "/path/to/some/page",
        },
        {
          label: "Mon logement",
          name: "logement",
          state: "done",
          root: "/path/to/yet/another/page",
        },
        {
          label: "Mes revenus",
          name: "revenus",
          state: "done",
          root: "/path/to/yet/another/page/again",
        },
      ])
    })

    describe("when lastUnansweredStep is provided", function () {
      const lastUnansweredStep = "/path/to/yet/another/page"

      it("returns the active with corresponding states", function () {
        expect(getChapters(currentPath, journey, lastUnansweredStep)).toEqual([
          {
            label: "Mon profil",
            name: "profil",
            state: "done",
            root: "/path/to/some/page",
          },
          {
            label: "Mon logement",
            name: "logement",
            state: "current",
            root: "/path/to/yet/another/page",
          },
          {
            label: "Mes revenus",
            name: "revenus",
            state: "pending",
            root: "/path/to/yet/another/page/again",
          },
        ])
      })
    })
  })
})
