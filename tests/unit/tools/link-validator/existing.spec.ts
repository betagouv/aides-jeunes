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
      const existing = {
        [benefitData.id]: {
          [bogusLink.type]: {
            id: 42,
            fields: {
              Erreur: bogusLink.status,
            },
          },
        },
      }
      const operations = determineOperations(existing, benefitData)
      expect(operations).toHaveLength(0)
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
      const existing = {
        [benefitData.id]: {
          [bogusLink.type]: {
            id: 42,
            fields: {
              Erreur: 403,
            },
          },
        },
      }
      const operations = determineOperations(existing, benefitData)
      expect(operations).toHaveLength(1)

      const updateOperation = operations[0]
      expect(updateOperation).toHaveProperty("type", "update")
      expect(updateOperation).toHaveProperty("record")
      expect(updateOperation.record).toHaveProperty("id", 42)
      expect(updateOperation.record.fields).toHaveProperty("Corrige", true)
    })
  })
})
