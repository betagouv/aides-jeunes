/**
 * @jest-environment jsdom
 */
//import { mount } from '@vue/test-utils'
import InputDate from "@/components/input-date.vue"

describe("input-date.vue", () => {
  it("correctly format dates", () => {
    const testSet = [
      { day: "12", month: "12", year: "2001", result: "2001-12-12" },
      { day: "1", month: "9", year: "2001", result: "2001-09-01" },
    ]
    for (const test of testSet) {
      expect(
        InputDate.computed.date.call({
          year: test["year"],
          month: test["month"],
          day: test["day"],
        })
      ).toMatch(test["result"])
    }
  })

  it("accept valid dates", async () => {
    const testSet = [{ date: "2001-12-14", result: new Date("2001-12-14") }]
    for (const test of testSet) {
      let emitted
      InputDate.methods.update.call({
        date: test.date,
        $emit: (name, value) => (emitted = { name, value }),
      })
      expect(emitted.value).toEqual(test.result)
    }
  })

  /*
  it('accept valid dates', async () => {
    const modelValue = '2007-12-12'
    const wrapper = mount(InputDate, {
      //props: { model: modelValue },
      directives: {
        "select-on-click"() { }
      }
    })

    const testSet = {
      day: 12,
      month: 12,
      year: 2001
    }
    const elements = {

    }

    console.log(wrapper.methods)
    
    //await day.setValue('12')
    //await month.setValue('12')
    //await year.setValue('year')
    //expect(input.element.value).toBe('12')
    
    expect(wrapper.emitted()).toHaveProperty('modelValue')
    //update:modelValue



    //console.log(wrapper)
    //expect(wrapper.text()).toMatch(modelValue)
  })
  */
})
