import expect from "expect"
import { buildAPA } from "@root/data/benefits/dynamic/apa"
import { buildFSL } from "@root/data/benefits/dynamic/fsl"
import { getSchemaValidator } from "@root/data/json-schemas"

const additionalBenefitAttributes = {
  id: { type: "string" },
  source: { type: "string" },
}
const validator = getSchemaValidator(
  "benefits_javascript",
  additionalBenefitAttributes
)

describe("Javascript benefit generator", () => {
  const apaBenefits = buildAPA()
  const fslBenefits = buildFSL()

  const benefits = [...apaBenefits, ...fslBenefits]

  for (const benefit of benefits) {
    describe(benefit.id, () => {
      it("has a valid schema", () => {
        validator(benefit)
        expect(validator.errors).toBeFalsy()
      })
    })
  }
})
