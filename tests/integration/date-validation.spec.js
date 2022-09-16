import { useDateValidation } from "@root/src/composables/useDateValidation.ts"
describe("Date validation", () => {
  const { day, month, year, dayValidation, monthValidation, yearValidation } =
    useDateValidation()
  describe("Day validation", () => {
    it("Day should be > 0 and < 32 and a 1 or 2 char length string", () => {
      day.value = "2"
      let res = dayValidation()
      expect(res).toEqual(true)
      day.value = "02"
      res = dayValidation()
      expect(res).toEqual(true)
      day.value = "020"
      res = dayValidation()
      expect(res).toEqual(false)
      day.value = "0"
      res = dayValidation()
      expect(res).toEqual(false)
      day.value = "-5"
      res = dayValidation()
      expect(res).toEqual(false)
      day.value = "32"
      res = dayValidation()
      expect(res).toEqual(false)
    })
  })
  describe("Month validation", () => {
    it("Month should be > 0 and < 12 and a 1 or 2 char length string", () => {
      month.value = "2"
      let res = monthValidation()
      expect(res).toEqual(true)
      month.value = "02"
      res = monthValidation()
      expect(res).toEqual(true)
      month.value = "020"
      res = monthValidation()
      expect(res).toEqual(false)
      month.value = "0"
      res = monthValidation()
      expect(res).toEqual(false)
      month.value = "-8"
      res = monthValidation()
      expect(res).toEqual(false)
      month.value = "13"
      res = monthValidation()
      expect(res).toEqual(false)
    })
  })
  describe("Year validation", () => {
    it("Year should be > 1900 and < the current year and a 4 char length string", () => {
      const currentYear = new Date().getFullYear()
      year.value = "0"
      let res = yearValidation()
      expect(res).toEqual(false)
      year.value = "00"
      res = yearValidation()
      expect(res).toEqual(false)
      year.value = "000"
      res = yearValidation()
      expect(res).toEqual(false)
      year.value = "0000"
      res = yearValidation()
      expect(res).toEqual(false)
      year.value = "1901"
      res = yearValidation()
      expect(res).toEqual(true)
      year.value = "99999"
      res = yearValidation()
      expect(res).toEqual(false)
      year.value = currentYear.toString()
      res = yearValidation()
      expect(res).toEqual(true)
      year.value = (currentYear + 1).toString()
      res = yearValidation()
      expect(res).toEqual(false)
    })
  })
})
