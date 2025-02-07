import { expect } from "vitest"
import InputNumber from "@/components/input-number.vue"
import { mount } from "@vue/test-utils"
import SelectOnClickDirective from "@/directives/select-on-click.js"

async function testInputNumber(
  input: string | undefined,
  result: number | string | undefined,
  error: boolean = false,
  min?: number,
  max?: number
): Promise<void> {
  const wrapper = await mount(InputNumber, {
    global: { directives: { "select-on-click": SelectOnClickDirective } },
    props: { modelValue: input, min, max },
  })

  if (input !== undefined) {
    await wrapper.find("input").setValue(input)
  }
  await wrapper.find("input").trigger("input")
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toEqual(result)
  expect(wrapper.emitted("input-error")?.at(-1)?.[0]).toBe(error)
}

describe("input-number.vue", () => {
  it("accept valid values", async () => {
    const testSet = [
      { input: "1", result: 1 },
      { input: "27,45", result: 27.45 },
      { input: "15.12", result: 15.12 },
      { input: "1 022", result: 1022 },
      { input: "044", result: 44 },
      { input: "-1.45", result: -1.45 },
      { input: "200.0", result: 200 },
      { input: "", result: "" },
    ]

    for (const test of testSet) {
      await testInputNumber(test.input, test.result)
    }
  })

  it("remove improper input from valid numbers", async () => {
    const testSet = [
      { input: "a1", result: 1 },
      { input: "1a", result: 1 },
      { input: "1.", result: 1 },
      { input: "200.0", result: 200 },
      { input: "1a2", result: 12 },
      { input: "1.2.3", result: 1.2 },
    ]

    for (const test of testSet) {
      await testInputNumber(test.input, test.result)
    }
  })

  it("reject invalid numbers", async () => {
    const testSet = [
      { input: "1+2", result: 12, error: false },
      { input: "Infinity", result: "", error: false },
      { input: "1e25", result: 125, error: false },
      { input: undefined, result: "", error: false },
    ]

    for (const test of testSet) {
      await testInputNumber(test.input, test.result, test.error)
    }
  })

  it("control numbers following rules", async () => {
    const testSet = [
      { input: "2", result: 2, min: 0 },
      { input: "-2", result: -2, min: 0, error: true },
      { input: "4", result: 4, max: 5 },
      { input: "5", result: 5, max: 5 },
      { input: "6", result: 6, max: 5, error: true },
      { input: "5", result: 5, min: 5, max: 5 },
      { input: "-5", result: -5, min: -5, max: -5 },
    ]

    for (const test of testSet) {
      await testInputNumber(
        test.input,
        test.result,
        test.error,
        test.min,
        test.max
      )
    }
  })
})
