import { expect } from "@jest/globals"
import benefits from "@root/data/all.js"

import generator from "@root/data/benefits/aides-velo-generator.js"
import { benefitVeloLayout } from "@root/data/types/benefits.js"
import epci from "@etalab/decoupage-administratif/data/epci.json" assert { type: "json" }

describe("aides velo benefit generator", function () {
  const list: benefitVeloLayout[] = generator(
    Object.values(benefits.institutionsMap)
  )

  list.forEach((benefit) => {
    it("generates simple benefit ids", function () {
      expect(benefit.id).toMatch(/^[0-9a-zA-Z_éàèëçâôûœ-]+$/)
    })

    it("verify description exists", function () {
      expect(benefit.description?.length).toBeGreaterThanOrEqual(1)
    })

    it("verify description do not contain interpolate variable", function () {
      expect(benefit.description).not.toMatch(/((\s\$)+|(^\$)+)\w+/)
    })
  })

  it("maps all benefits to existing institutions", function () {
    const missingInstitutionBenefits = list.filter((b) => !b.institution)

    const missingCommune = missingInstitutionBenefits.filter(
      (b) => b.collectivity.kind === "code insee"
    )
    if (missingCommune.length) {
      console.log(missingCommune.map((b) => b.description).join("\n"))
    }

    const missingEPCI = missingInstitutionBenefits.filter(
      (b) => b.collectivity.kind === "epci"
    )
    if (missingEPCI.length) {
      missingEPCI.forEach((b) => {
        const EPCIMatch = epci.find((e) =>
          e.nom.match(new RegExp(b.collectivity.value.replace("’", "'"), "i"))
        )
        console.log(
          (b) => `${b.description} - ${`code_siren:  '${EPCIMatch?.code}'`}`
        )
      })
    }

    const missingOtherInstitution = missingInstitutionBenefits.filter(
      (b) => !["code insee", "epci"].includes(b.collectivity.kind)
    )
    if (missingOtherInstitution.length) {
      console.log(
        missingOtherInstitution
          .map((b) => `${b.description} | code_insee : ${b.collectivity.value}`)
          .join("\n")
      )
    }

    expect(missingCommune.length).toEqual(0)
    expect(missingEPCI.length).toEqual(0)
    expect(missingOtherInstitution.length).toEqual(0)
  })
})
