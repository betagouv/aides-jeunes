import { expect } from "@jest/globals"
import { determineOperationsOnBenefitLinkError } from "../../../../lib/benefits/link-validity.js"
import { makeBenefitData } from "./utils.js"

describe("check-link-validity script", () => {
  describe("with new errors", () => {
    it("should add an row to process manually", () => {
      const bogusLink = {
        link: "https://li.nk/ko",
        type: "link",
        status: 403,
        ok: false,
      }
      const benefitData = makeBenefitData({ links: [bogusLink] })
      const operations = determineOperationsOnBenefitLinkError({}, benefitData)

      expect(operations).toHaveLength(1)
      const { type, data } = operations[0]
      expect(type).toEqual("add")
      const fields = data.fields
      expect(fields).toHaveProperty("Aide", benefitData.id)
      expect(fields).toHaveProperty("Lien", bogusLink.link)
    })
  })
})
