import expect from "expect"
import { buildAPA } from "../../data/benefits/dynamic/apa.js"
import { buildFSL } from "../../data/benefits/dynamic/fsl.js"

describe("Javascript benefit generator", () => {
  const apaBenefits = buildAPA()
  const fslBenefits = buildFSL()

  const benefits = [...apaBenefits, ...fslBenefits].map((benefit) => {
    return benefit
  })

  for (const benefit of benefits) {
    describe(`${benefit.source} - ${benefit.id}`, () => {
      it("Should have a javascript source, a label, a link and at least one non-empty [instruction / form]", () => {
        expect(benefit.source).toEqual("javascript")
        expect(benefit.label.length).not.toEqual(0) &&
          expect(benefit.link.length).not.toEqual(0) &&
          (expect(benefit.instruction.length).not.toEqual(0) ||
            expect(benefit.form.length).not.toEqual(0))
      })
    })
  }
})
