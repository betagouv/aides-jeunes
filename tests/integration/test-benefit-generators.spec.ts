import { expect } from "@jest/globals"
import { buildAPA } from "@root/data/benefits/dynamic/apa.js"
import { buildFSL } from "@root/data/benefits/dynamic/fsl.js"
import { compareSchema, getCollectionSchema } from "@root/data/schemas.js"
const benefitSchema = getCollectionSchema("benefits_javascript")

describe("Javascript benefit generator", () => {
  const apaBenefits = buildAPA()
  const fslBenefits = buildFSL()

  const benefits = [...apaBenefits, ...fslBenefits]

  for (const benefit of benefits) {
    describe(`${benefit.source} - ${benefit.id}`, () => {
      const errorsResult = []
      compareSchema(benefit, benefitSchema, errorsResult)
      it("should respect Javascript Benefit schema", () => {
        expect(errorsResult).toEqual([])
      })
    })
  }
})
