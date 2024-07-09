import { expect } from "@jest/globals"
import InputDate from "@/components/input-date.vue"

describe("input-date.vue", () => {
  it("correctly format dates", () => {
    const testSet = [
      { day: "12", month: "12", year: "2001", result: "2001-12-12" },
      { day: "1", month: "9", year: "2001", result: "2001-09-01" },
    ]
    for (const test of testSet) {
      expect(
        InputDate.default.computed.date.call({
          year: test["year"],
          month: test["month"],
          day: test["day"],
        })
      ).toMatch(test["result"])
    }
  })

  it("accept valid dates", async () => {
    const testSet = [
      { date: "2001-12-14", result: new Date("2001-12-14") },
      { date: "1800-01-01", result: "wrong-date" },
      { date: "2100-01-01", result: "wrong-date" },
      { date: "-01-01", result: "incomplete-date" },
      { date: "2010--01", result: "incomplete-date" },
      { date: "2010-01-", result: "incomplete-date" },
    ]
    for (const test of testSet) {
      let emitted
      InputDate.default.methods.update.call({
        date: test.date,
        $emit: (name, value) => (emitted = { name, value }),
      })
      expect(emitted.value).toEqual(test.result)
    }
  })
})
