import { expect } from "@jest/globals"
import InputNumber from "@/components/input-number.vue"

describe("input-number.vue", () => {
  it("accept valid numbers", async () => {
    const testSet = [
      { input: "1", result: 1 },
      { input: "27,45", result: 27.45 },
      { input: "15.12", result: 15.12 },
      { input: "1 022", result: 1022 },
      { input: "044", result: 44 },
      { input: "-1.45", result: -1.45 },
      { input: "200.0", result: 200 },
      { input: "", result: 0 },
    ]
    for (const test of testSet) {
      let emitted
      InputNumber.default.computed.model.set.call(
        {
          $emit: (name, value) => (emitted = { name, value }),
          parseInputString: InputNumber.default.methods.parseInputString,
        },
        test.input
      )
      expect(emitted.value).toEqual(test.result)
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
      let emitted
      InputNumber.default.computed.model.set.call(
        {
          $emit: (name, value) => (emitted = { name, value }),
          parseInputString: InputNumber.default.methods.parseInputString,
        },
        test.input
      )
      expect(emitted.value).toEqual(test.result)
    }
  })
  it("reject invalid numbers", async () => {
    const testSet = [
      { input: "1+2", result: 12 },
      { input: "Infinity", result: 0 },
      { input: "1e25", result: 125 },
      { input: undefined, result: undefined },
      { input: null, result: null },
    ]
    for (const test of testSet) {
      let emitted
      InputNumber.default.computed.model.set.call(
        {
          $emit: (name, value) => (emitted = { name, value }),
          parseInputString: InputNumber.default.methods.parseInputString,
        },
        test.input
      )
      expect(emitted.value).toEqual(test.result)
    }
  })
  it("control numbers following rules", async () => {
    const testSet = [
      { input: "2", result: 2, min: 0 },
      { input: "-2", result: "-2", min: 0 },
      { input: "4", result: 4, max: 5 },
      { input: "5", result: 5, max: 5 },
      { input: "6", result: "6", max: 5 },
      { input: "5", result: 5, min: 5, max: 5 },
      { input: "-5", result: -5, min: -5, max: -5 },
    ]
    for (const test of testSet) {
      let emitted
      const input = InputNumber
      input.default.computed.model.set.call(
        {
          min: test.min,
          max: test.max,
          $emit: (name, value) => (emitted = { name, value }),
          parseInputString: InputNumber.default.methods.parseInputString,
        },
        test.input,
        test.min,
        test.max
      )
      expect(emitted.value).toEqual(test.result)
    }
  })
})
