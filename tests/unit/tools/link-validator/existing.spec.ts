import { determineOperationsOnBenefitLinkError } from "../../../../lib/benefits/link-validity.js"
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
      const operations = determineOperationsOnBenefitLinkError(
        existing,
        benefitData
      )
      expect(operations.add).toHaveLength(0)
      expect(operations.keep).toHaveLength(1)
      expect(operations.keep[0]).toEqual(warningRecord)
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
          Type: "link",
          Erreur: 403,
        },
      }
      const existing = {
        [benefitData.id]: {
          [bogusLink.type]: warningRecord,
        },
      }
      const operations = determineOperationsOnBenefitLinkError(
        existing,
        benefitData
      )
      expect(operations.add).toHaveLength(0)
      expect(operations.update).toHaveLength(1)
      expect(operations.update[0].id).toEqual(warningRecord.id)
    })
  })
})
