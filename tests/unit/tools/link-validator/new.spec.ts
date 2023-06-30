import { getRequiredAdditionsAndTouchWarningsToKeep } from "../../../../lib/benefits/link-validity.js"
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
      const records = getRequiredAdditionsAndTouchWarningsToKeep(
        {},
        benefitData
      )

      expect(records).toHaveLength(1)
      const record = records[0]
      const fields = record.fields
      expect(fields).toHaveProperty("Aide", benefitData.id)
      expect(fields).toHaveProperty("Lien", bogusLink.link)
    })
  })
})
