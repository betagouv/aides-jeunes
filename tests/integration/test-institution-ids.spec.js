import expect from "expect"

import Benefits from "../../data/index.js"
import jamstackLoader from "jamstack-loader"
const configFile = "contribuer/public/admin/config.yml"
import epci from "@etalab/decoupage-administratif/data/epci.json"

describe("Institution id", () => {
  const jamstack = jamstackLoader.get(configFile)
  const institutions = jamstack.collections.institutions.items
  const institutionIds = []
  const institutionSirenCodes = []
  const epciSirenCodes = epci.map((epci) => epci.code)

  for (const institution of institutions) {
    describe(institution.slug, () => {
      it("should be unique", () => {
        const id = Benefits.generateInstitutionId(institution)
        expect(institutionIds).not.toContain(id)
        institutionIds.push(id)
      })

      if (institution.type === "EPCI (Métropole, inter-communauté, etc.)") {
        it("has a unique siren code", () => {
          expect(institutionSirenCodes).not.toContain(institution.siren_code)
          institutionIds.push(institution.siren_code)
        })

        it("has a valid siren code", () => {
          expect(epciSirenCodes).toContain(institution.code_siren)
        })
      }
    })
  }
})
