import expect from "expect"
import Benefits from "@root/data/all"
import {
  FSL_BY_CODE,
  build,
  getInstitutionName,
} from "../../data/benefits/dynamic/fsl"

describe("Fsl benefits", function () {
  const fslBenefits = build(Benefits.institutionsMap)
  const FSL_CODES = Object.keys(FSL_BY_CODE)

  it("should have an same length of initial", function () {
    expect(fslBenefits.length).toEqual(FSL_CODES.length)
  })

  for (const code of FSL_CODES) {
    it("should have a matching institution for each code", function () {
      const institutionName = getInstitutionName(Benefits.institutionsMap, code)
      expect(
        fslBenefits.some(
          (fslBenefit) => fslBenefit.institution === institutionName
        )
      ).toBeTruthy()
    })
  }
})
