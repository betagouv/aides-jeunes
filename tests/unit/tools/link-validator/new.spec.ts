import { determineOperations } from "../../../../lib/benefits/link-validity.js"
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
      const operations = determineOperations({}, benefitData)

      expect(operations).toHaveLength(1)
      const operation = operations[0]
      expect(operation).toHaveProperty("type", "addition")
      expect(operation).toHaveProperty("record")
      const fields = operation.record.fields
      expect(fields).toHaveProperty("Aide", benefitData.id)
      expect(fields).toHaveProperty("Lien", bogusLink.link)
    })
  })
})
