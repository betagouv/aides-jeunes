import { expect } from "vitest"
import jamstackLoader from "@betagouv/jamstack-loader"
import path from "path"

const jamstack = jamstackLoader.get(
  path.resolve(__dirname, "../../contribuer/public/admin/config.yml"),
)

describe("Schema validation", function () {
  describe("config", function () {
    it("should not have local_backend true", function () {
      expect(Boolean(jamstack.local_backend)).toBe(false)
    })
  })

  describe("benefits", function () {
    const institutions = jamstack.collections.institutions.items
    const institutionMap = institutions.reduce((result, item) => {
      result[item.slug] = item
      return result
    }, {})

    const benefits = [
      ...jamstack.collections.benefits_openfisca.items,
      ...jamstack.collections.benefits_javascript.items,
    ]

    benefits.forEach((benefit) => {
      describe(benefit.slug, function () {
        describe(`institution value '${benefit.institution}'`, function () {
          it("should refer to the slug/filename of an existing institution", function () {
            expect(institutionMap[benefit.institution]).toBeTruthy()
          })
        })
      })
    })
  })
})
