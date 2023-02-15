import expect from "expect"
import { isGeographicallyIncluded } from "@root/lib/benefits/geographical-count-utils"

describe("geographical benefit count", function () {
  // Arcachon
  const arcachon = "33009"
  it("works for national institution", function () {
    const result = isGeographicallyIncluded(
      { code: arcachon },
      { type: "Organisation nationale" }
    )
    expect(result).toEqual(true)
  })

  describe("logic for regional institution", function () {
    it("works for relevant region", function () {
      // 75 = Nouvelle Aquitaine
      const result = isGeographicallyIncluded(
        { code: arcachon, region: "75" },
        { type: "Région", code_insee: "75" }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant region", function () {
      // 11 = Île-de-France
      const result = isGeographicallyIncluded(
        { code: arcachon, region: "75" },
        { type: "Région", code_insee: "11" }
      )
      expect(result).toEqual(false)
    })
  })

  describe("logic for departemental institution", function () {
    it("works for relevant departemental", function () {
      // 33 = Gironde
      const result = isGeographicallyIncluded(
        { code: arcachon, departement: "33" },
        { type: "Département", code_insee: "33" }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant departement", function () {
      // 75 = Paris
      const result = isGeographicallyIncluded(
        { code: arcachon, departement: "33" },
        { type: "Département", code_insee: "75" }
      )
      expect(result).toEqual(false)
    })
  })
  describe("logic for epci institution", function () {
    it("works for relevant epci", function () {
      // 243300563 = CA Bassin d'Arcachon Sud-Pôle Atlantique (COBAS)
      const result = isGeographicallyIncluded(
        { code: arcachon },
        {
          type: "EPCI (Métropole, inter-communauté, etc.)",
          code_siren: "243300563",
        }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant epci", function () {
      // 200035319 = CA Var Estérel Méditerranée (Cavem)
      const result = isGeographicallyIncluded(
        { code: arcachon },
        {
          type: "EPCI (Métropole, inter-communauté, etc.)",
          code_siren: "200035319",
        },
        { membres: [{ code: "75056" }] }
      )
      expect(result).toEqual(false)
    })
  })

  describe("logic for communal institution", function () {
    it("works for relevant commune", function () {
      const result = isGeographicallyIncluded(
        { code: arcachon },
        { type: "Commune", code_insee: arcachon }
      )
      expect(result).toEqual(true)
    })

    it("works for irrelevant commune", function () {
      // 75056 = Paris
      const result = isGeographicallyIncluded(
        { code: arcachon },
        { type: "Commune", code_insee: "75056" }
      )
      expect(result).toEqual(false)
    })
  })
})
