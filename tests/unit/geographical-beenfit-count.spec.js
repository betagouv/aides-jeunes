const expect = require("expect")
const {
  isGeographicallyIncluded,
} = require("../../lib/benefits/geographical-count-utils")

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

  describe("logic for departemental institution", function () {
    it("works for relevant departemental", function () {
      // 33 = Gironde
      const result = isGeographicallyIncluded(arcachon, {
        type: "departement",
        id: "33",
      })
      expect(result).toEqual(true)
    })

    it("works for irrelevant departement", function () {
      // 75 = Paris
      const result = isGeographicallyIncluded(arcachon, {
        type: "departement",
        id: "75",
      })
      expect(result).toEqual(false)
    })
  })

  describe("logic for epci institution", function () {
    it("works for relevant epci", function () {
      // 243300563 = CA Bassin d'Arcachon Sud-Pôle Atlantique (COBAS)
      const result = isGeographicallyIncluded(arcachon, {
        type: "epci",
        id: "243300563",
      })
      expect(result).toEqual(true)
    })

    it("works for irrelevant epci", function () {
      // 200035319 = CA Bassin d'Arcachon Sud-Pôle Atlantique (COBAS)
      const result = isGeographicallyIncluded(arcachon, {
        type: "epci",
        id: "200035319",
      })
      expect(result).toEqual(false)
    })
  })

  describe("logic for communal institution", function () {
    it("works for relevant commune", function () {
      const result = isGeographicallyIncluded(arcachon, {
        type: "commune",
        id: arcachon,
      })
      expect(result).toEqual(true)
    })

    it("works for irrelevant commune", function () {
      // 75056 = Paris
      const result = isGeographicallyIncluded(arcachon, {
        type: "commune",
        id: "75056",
      })
      expect(result).toEqual(false)
    })
  })
})
