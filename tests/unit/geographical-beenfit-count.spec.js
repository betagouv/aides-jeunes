const expect = require("expect")
const {
  isGeographicallyIncluded,
} = require("../../tools/geographical-benefit-count")

describe("geographical benefit count", function () {
  // Arcachon
  const arcachon = "33009"
  it("works for national institution", function () {
    const result = isGeographicallyIncluded(arcachon, { type: "national" })
    expect(result).toEqual(true)
  })

  describe("logic for regional institution", function () {
    it("works for relevant region", function () {
      // 75 = Nouvelle Aquitaine
      const result = isGeographicallyIncluded(arcachon, {
        type: "region",
        id: "75",
      })
      expect(result).toEqual(true)
    })

    it("works for irrelevant region", function () {
      // 11 = Île-de-France
      const result = isGeographicallyIncluded(arcachon, {
        type: "region",
        id: "11",
      })
      expect(result).toEqual(false)
    })
  })
})
