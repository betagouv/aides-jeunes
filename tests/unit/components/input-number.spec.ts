import { expect, describe, it } from "vitest"
import { render, fireEvent } from "@testing-library/vue"
import InputNumber from "@/components/input-number.vue"
import SelectOnClickDirective from "@/directives/select-on-click.js"

describe("input-number.vue", () => {
  const options = {
    global: {
      directives: {
        "select-on-click": SelectOnClickDirective,
      },
    },
  }

  it.each([
    { input: "1", result: 1 },
    { input: "27,45", result: 27.45 },
    { input: "15.12", result: 15.12 },
    { input: "1 022", result: 1022 },
    { input: "044", result: 44 },
    { input: "-1.45", result: -1.45 },
    { input: "200.0", result: 200 },
    { input: "", result: "" },
  ])("accept valid values: $input -> $result", async ({ input, result }) => {
    const { getByRole, emitted } = render(InputNumber, options)
    const inputEl = getByRole("textbox")

    await fireEvent.update(inputEl, input)

    const events = emitted()["update:modelValue"] as [number | string][]
    const errorEvents = emitted()["input-error"] as [boolean][]

    expect(events[events.length - 1][0]).toEqual(result)
    expect(errorEvents[errorEvents.length - 1][0]).toBe(false)
  })

  it.each([
    { input: "a1", result: 1 },
    { input: "1a", result: 1 },
    { input: "1.", result: 1 },
    { input: "200.0", result: 200 },
    { input: "1a2", result: 12 },
    { input: "1.2.3", result: 1.2 },
  ])(
    "remove improper input from valid numbers: $input -> $result",
    async ({ input, result }) => {
      const { getByRole, emitted } = render(InputNumber, options)
      const inputEl = getByRole("textbox")

      await fireEvent.update(inputEl, input)

      const events = emitted()["update:modelValue"] as [number | string][]
      const errorEvents = emitted()["input-error"] as [boolean][]

      expect(events[events.length - 1][0]).toEqual(result)
      expect(errorEvents[errorEvents.length - 1][0]).toBe(false)
    },
  )

  it.each([
    { input: "1+2", result: 12, error: false },
    { input: "Infinity", result: "", error: false },
    { input: "1e25", result: 125, error: false },
    { input: undefined, result: "", error: false },
  ])("reject invalid numbers: $input", async ({ input, result, error }) => {
    const { getByRole, emitted } = render(InputNumber, options)
    const inputEl = getByRole("textbox")

    await fireEvent.update(inputEl, input ?? "")

    const events = emitted()["update:modelValue"] as [number | string][]
    const errorEvents = emitted()["input-error"] as [boolean][]

    expect(events[events.length - 1][0]).toEqual(result)
    expect(errorEvents[errorEvents.length - 1][0]).toBe(error)
  })

  it.each([
    { input: "2", result: 2, min: 0 },
    { input: "-2", result: -2, min: 0, error: true },
    { input: "4", result: 4, max: 5 },
    { input: "5", result: 5, max: 5 },
    { input: "6", result: 6, max: 5, error: true },
    { input: "5", result: 5, min: 5, max: 5 },
    { input: "-5", result: -5, min: -5, max: -5 },
  ])(
    "control numbers following rules: $input (min:$min, max:$max)",
    async ({ input, result, min, max, error = false }) => {
      const { getByRole, emitted } = render(InputNumber, {
        ...options,
        props: { min, max },
      })
      const inputEl = getByRole("textbox")

      await fireEvent.update(inputEl, input)

      const events = emitted()["update:modelValue"] as [number | string][]
      const errorEvents = emitted()["input-error"] as [boolean][]

      expect(events[events.length - 1][0]).toEqual(result)
      expect(errorEvents[errorEvents.length - 1][0]).toBe(error)
    },
  )
})
