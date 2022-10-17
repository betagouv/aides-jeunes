import { isEqual, range } from "@root/lib/utils"

describe("isEqual function", () => {
  const testSet = [
    { left: "Aa", right: "Aa", result: true },
    { left: "Aa", right: "Ab", result: false },
    { left: "Aa", right: "AA", result: false },
    { left: "A1a", right: "A1a", result: true },
    { left: false, right: false, result: true },
    { left: true, right: false, result: false },
    { left: ["a", "b", "c"], right: ["a", "b", "c"], result: true },
    { left: ["a", "b", "c"], right: ["a", "b", "d"], result: false },
    {
      left: new Date("2022-04-12"),
      right: new Date("2022-04-12"),
      result: true,
    },
    {
      left: new Date("2022-04-12"),
      right: new Date("2022-04-14"),
      result: false,
    },
    { left: true, right: undefined, result: false },
    { left: { value: "a" }, right: { value: "a" }, result: true },
    { left: { value: "a" }, right: { value: "b" }, result: false },
    { left: [{ value: "a" }], right: [{ value: "a" }], result: true },
    { left: [{ value: "a" }], right: [{ value: "b" }], result: false },
  ]
  for (let test of testSet) {
    it("compares simple values", () => {
      expect(isEqual(test.left, test.right)).toEqual(test.result)
    })
  }

  it("compare complex matching object", () => {
    const left = [
      { label: "birthdate", value: new Date("2022-04-12") },
      {
        label: "revenus",
        value: {
          2022: [750, { tax: 17 }],
          2021: [750, 740],
          2020: { tax: 40 },
        },
      },
      { label: "city", value: "Paris" },
      { label: "Prime", value: undefined },
    ]
    const right = [
      { label: "birthdate", value: new Date("2022-04-12") },
      {
        label: "revenus",
        value: {
          2021: [750, 740],
          2022: [750, { tax: 17 }],
          2020: { tax: 40 },
        },
      },
      { value: "Paris", label: "city" },
      { value: undefined, label: "Prime" },
    ]
    expect(isEqual(left, right)).toEqual(true)
  })

  it("compare complex non-matching object", () => {
    const left = [
      { label: "birthdate", value: new Date("2022-04-12") },
      {
        label: "revenus",
        value: {
          2022: [750, { tax: 17 }],
          2021: [750, 740],
          2020: { tax: 40 },
        },
      },
      { label: "city", value: "Paris" },
      { label: "Prime", value: undefined },
    ]
    const right = [
      { label: "birthdate", value: new Date("2022-04-12") },
      {
        label: "revenus",
        value: {
          2021: [750, 740],
          2022: [750, { tax: 13 }],
          2020: { tax: 40 },
        },
      },
      { value: "Paris", label: "city" },
      { value: undefined, label: "Prime" },
    ]
    expect(isEqual(left, right)).toEqual(false)
  })
})

describe("range function", () => {
  const testSet = [
    { start: 0, end: 1, result: [0] },
    { start: 0, end: 5, result: [0, 1, 2, 3, 4] },
    { start: 2, result: [0, 1] },
    { start: 5, result: [0, 1, 2, 3, 4] },
    { start: 1, end: 4, result: [1, 2, 3] },
  ]
  for (let test of testSet) {
    it("compares simple values", () => {
      expect(range(test.start, test.end ? test.end : undefined)).toEqual(
        test.result
      )
    })
  }
})
