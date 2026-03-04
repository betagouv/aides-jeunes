import { expect, describe, it } from "vitest"
import { render, fireEvent } from "@testing-library/vue"
import InputDate from "@/components/input-date.vue"
import SelectOnClickDirective from "@/directives/select-on-click.js"

describe("input-date.vue", () => {
  const options = {
    global: {
      directives: {
        "select-on-click": SelectOnClickDirective,
      },
    },
  }

  it.each([
    { day: "12", month: "12", year: "2001", result: new Date("2001-12-12") },
    { day: "1", month: "9", year: "2001", result: new Date("2001-09-01") },
  ])(
    "emits $result when input is $day/$month/$year",
    async ({ day, month, year, result }) => {
      const { getAllByRole, emitted } = render(InputDate, options)
      // Retrieve inputs in DOM order: Day, Month, Year
      const [dayInput, monthInput, yearInput] = getAllByRole("textbox")

      await fireEvent.update(dayInput, day)
      await fireEvent.update(monthInput, month)
      await fireEvent.update(yearInput, year)

      const events = emitted()["update:modelValue"] as [Date | string][]
      console.log(events, "ev")
      // Check the last emitted value
      const lastEmitted = events[events.length - 1][0]
      expect(lastEmitted).toEqual(result)
    },
  )

  it.each([
    { year: "2001", month: "12", day: "14", result: new Date("2001-12-14") },
    { year: "1800", month: "01", day: "01", result: "wrong-date" },
    { year: "2100", month: "01", day: "01", result: "wrong-date" },
    { year: "", month: "01", day: "01", result: "incomplete-date" },
    { year: "2010", month: "", day: "01", result: "incomplete-date" },
    { year: "2010", month: "01", day: "", result: "incomplete-date" },
  ])(
    "validates date: $day/$month/$year -> $result",
    async ({ day, month, year, result }) => {
      const { getAllByRole, emitted } = render(InputDate, options)
      const [dayInput, monthInput, yearInput] = getAllByRole("textbox")

      await fireEvent.update(dayInput, day)
      await fireEvent.update(monthInput, month)
      await fireEvent.update(yearInput, year)

      const events = emitted()["update:modelValue"] as [Date | string][]
      const lastEmitted = events[events.length - 1][0]
      expect(lastEmitted).toEqual(result)
    },
  )
})
