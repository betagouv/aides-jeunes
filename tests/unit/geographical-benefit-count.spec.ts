import { expect } from "@jest/globals"
import { isGeographicallyIncluded } from "@root/lib/benefits/geographical-count-utils.js"

describe("geographical benefit count", function () {
  // Arcachon
  const arcachon = "33009"
  it("works for national institution", function () {
    const result = isGeographicallyIncluded(
      { code: arcachon },
      { type: "national" }
    )
    expect(result).toEqual(true)
  })

  describe("logic for regional institution", function () {
    it("works for relevant region", function () {
      // 75 = Nouvelle Aquitaine
      const result = isGeographicallyIncluded(
        { code: arcachon, region: "75" },
        { type: "region", code_insee: "75" }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant region", function () {
      // 11 = Île-de-France
      const result = isGeographicallyIncluded(
        { code: arcachon, region: "75" },
        { type: "region", code_insee: "11" }
      )
      expect(result).toEqual(false)
    })
  })

  describe("logic for departemental institution", function () {
    it("works for relevant departemental", function () {
      // 33 = Gironde
      const result = isGeographicallyIncluded(
        { code: arcachon, departement: "33" },
        { type: "departement", code_insee: "33" }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant departement", function () {
      // 75 = Paris
      const result = isGeographicallyIncluded(
        { code: arcachon, departement: "33" },
        { type: "departement", code_insee: "75" }
      )
      expect(result).toEqual(false)
    })
  })
  describe("logic for epci institution", function () {
    it("works for relevant epci", function () {
      // 243300563 = CA Bassin d'Arcachon Sud-Pôle Atlantique (COBAS)
      const result = isGeographicallyIncluded(
        { code: arcachon },
        { type: "epci", code_siren: "243300563" }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant epci", function () {
      // 200035319 = CA Var Estérel Méditerranée (Cavem)
      const result = isGeographicallyIncluded(
        { code: arcachon },
        { type: "epci", code_siren: "200035319" },
        { membres: [{ code: "75056" }] }
      )
      expect(result).toEqual(false)
    })
  })

  describe("logic for communal institution", function () {
    it("works for relevant commune", function () {
      const result = isGeographicallyIncluded(
        { code: arcachon },
        { type: "commune", code_insee: arcachon }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant commune", function () {
      // 75056 = Paris
      const result = isGeographicallyIncluded(
        { code: arcachon },
        { type: "commune", code_insee: "75056" }
      )
      expect(result).toEqual(false)
    })
  })
})
