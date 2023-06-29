import { determineOperations } from "../../../../lib/benefits/link-validity.js"
import { makeBenefitData } from "./utils.js"

describe("check-link-validity script", () => {
  describe("with new errors", () => {
    it("shouldn't add a duplicate row", () => {
      const bogusLink = {
        link: "https://li.nk/ko",
        type: "link",
        status: 403,
        ok: false,
      }
      const benefitData = makeBenefitData({ links: [bogusLink] })
      const warningRecord = {
        id: 42,
        fields: {
          Erreur: bogusLink.status,
        },
      }
      const existing = {
        [benefitData.id]: {
          [bogusLink.type]: warningRecord,
        },
      }
      const operations = determineOperations(existing, benefitData)
      expect(operations).toHaveLength(0)
      expect(warningRecord).toHaveProperty("keep", true)
    })
  })

  describe("with a link no longer in error", () => {
    it("should update the corresponding row with a resolved status", () => {
      const bogusLink = {
        link: "https://li.nk/wasbefore",
        type: "link",
        status: 200,
        ok: true,
      }
      const benefitData = makeBenefitData({ links: [bogusLink] })
      const warningRecord = {
        id: 42,
        fields: {
          Erreur: 403,
        },
      }
      const existing = {
        [benefitData.id]: {
          [bogusLink.type]: warningRecord,
        },
      }
      const operations = determineOperations(existing, benefitData)
      expect(operations).toHaveLength(0)
      expect(warningRecord.keep).toBeFalsy()
    })
  })
})
