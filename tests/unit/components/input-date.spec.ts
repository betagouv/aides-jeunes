import { expect } from "vitest"
import { mount } from "@vue/test-utils"
import InputDate from "@/components/input-date.vue"
import SelectOnClickDirective from "@/directives/select-on-click.js"

describe("input-date.vue", () => {
  const mountInputDate = (data = {}) => {
    const app = mount(InputDate, {
      global: {
        directives: {
          "select-on-click": SelectOnClickDirective,
        },
      },
      data: () => data,
    })
    return app
  }

  it("correctly format dates", async () => {
    const testSet = [
      { day: "12", month: "12", year: "2001", result: "2001-12-12" },
      { day: "1", month: "9", year: "2001", result: "2001-09-01" },
    ]
    for (const test of testSet) {
      const wrapper = mountInputDate()
      await wrapper.setData({
        day: test.day,
        month: test.month,
        year: test.year,
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.date).toBe(test.result)
    }
  })

  it("accept valid dates", async () => {
    const testSet = [
      { year: "2001", month: "12", day: "14", result: new Date("2001-12-14") },
      { year: "1800", month: "01", day: "01", result: "wrong-date" },
      { year: "2100", month: "01", day: "01", result: "wrong-date" },
      { year: "", month: "01", day: "01", result: "incomplete-date" },
      { year: "2010", month: "", day: "01", result: "incomplete-date" },
      { year: "2010", month: "01", day: "", result: "incomplete-date" },
    ]
    for (const test of testSet) {
      const wrapper = mountInputDate()
      await wrapper.setData({
        day: test.day,
        month: test.month,
        year: test.year,
      })
      await wrapper.vm.$nextTick()
      const emitted = wrapper.emitted("update:modelValue")
      const lastEmitted = emitted?.at(-1)?.[0]
      expect(lastEmitted).toEqual(test.result)
    }
  })
})
