import expect from "expect"

import { chapters } from "@lib/state"

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
    expect(chapters(currentPath, journey)).toEqual([
      {
        label: "Mon profil",
        name: "profil",
        current: true,
        done: false,
        root: "/path/to/some/page",
      },
      {
        label: "Mon logement",
        name: "logement",
        current: false,
        done: false,
        root: "/path/to/yet/another/page",
      },
      {
        label: "Mes revenus",
        name: "revenus",
        current: false,
        done: false,
        root: "/path/to/yet/another/page/again",
      },
    ])
  })

  describe("when currentPath is at more advanced step", function () {
    const currentPath = "/path/to/yet/another/page"

    it("returns the active with corresponding states", function () {
      expect(chapters(currentPath, journey)).toEqual([
        {
          label: "Mon profil",
          name: "profil",
          done: true,
          current: false,
          root: "/path/to/some/page",
        },
        {
          label: "Mon logement",
          name: "logement",
          current: true,
          done: false,
          root: "/path/to/yet/another/page",
        },
        {
          label: "Mes revenus",
          name: "revenus",
          current: false,
          done: false,
          root: "/path/to/yet/another/page/again",
        },
      ])
    })
  })

  describe("when currentPath is not in journey", function () {
    const currentPath = "/path/to/unknown/page"

    it("returns the active with corresponding states", function () {
      expect(chapters(currentPath, journey)).toEqual([
        {
          label: "Mon profil",
          name: "profil",
          done: true,
          current: false,
          root: "/path/to/some/page",
        },
        {
          label: "Mon logement",
          name: "logement",
          done: true,
          current: false,
          root: "/path/to/yet/another/page",
        },
        {
          label: "Mes revenus",
          name: "revenus",
          done: true,
          current: false,
          root: "/path/to/yet/another/page/again",
        },
      ])
    })

    describe("when lastUnansweredStep is provided", function () {
      const lastUnansweredStep = "/path/to/yet/another/page"

      it("returns the active with corresponding states", function () {
        expect(chapters(currentPath, journey, lastUnansweredStep)).toEqual([
          {
            label: "Mon profil",
            name: "profil",
            done: true,
            current: false,
            root: "/path/to/some/page",
          },
          {
            label: "Mon logement",
            name: "logement",
            current: true,
            done: false,
            root: "/path/to/yet/another/page",
          },
          {
            label: "Mes revenus",
            name: "revenus",
            current: false,
            done: false,
            root: "/path/to/yet/another/page/again",
          },
        ])
      })
    })
  })
})
