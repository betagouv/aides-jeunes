import expect from "expect"

import Benefits from "../../data/index.js"
import jamstackLoader from "jamstack-loader"
const configFile = "contribuer/public/admin/config.yml"

describe("Institution id", () => {
  const jamstack = jamstackLoader.get(configFile)
  const institutions = jamstack.collections.institutions.items
  const institutionIds = []
  for (const institution of institutions) {
    describe(institution.slug, () => {
      it("should be unique", () => {
        const id = Benefits.generateInstitutionId(institution)
        expect(institutionIds).not.toContain(id)
        institutionIds.push(id)
      })
    })
  }
})
