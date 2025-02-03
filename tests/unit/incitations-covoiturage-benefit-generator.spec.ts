import { expect } from "@jest/globals"
import benefits from "@root/data/all.js"

import incitationsCovoiturageGenerator from "@root/data/benefits/dynamic/incitations-covoiturage.js"
import benefitsCovoiturage from "@root/data/benefits/dynamic/incitations-covoiturage.json" assert { type: "json" }
import { CovoiturageBenefit } from "@root/data/types/benefits.js"
import { Institution } from "@data/types/institutions.d.js"

describe("incitations benefit generator", function () {
  const list: CovoiturageBenefit[] =
    incitationsCovoiturageGenerator instanceof Function
      ? incitationsCovoiturageGenerator(Object.values(benefits.institutionsMap))
      : []

  list.forEach((benefit) => {
    it("generates simple benefit ids", function () {
      expect(benefit.id).toMatch(/^[a-z0-9_\-àâäéèêëîïôöùûüÿçœ]+$/i)
    })

    it("verify description exists", function () {
      expect(benefit.description?.length).toBeGreaterThanOrEqual(1)
    })

    it("verify description do not contain interpolate variable", function () {
      expect(benefit.description).not.toMatch(/((\s\$)+|(^\$)+)\w+/)
    })
  })

  it("maps all benefits to existing institutions", function () {
    if (benefitsCovoiturage.length) {
      const institutions = Object.values(benefits.institutionsMap)
      const missingEPCI: string[] = []
      benefitsCovoiturage.forEach((b) => {
        const institution = institutions.find(
          (i) => i.code_siren === b.code_siren
        )
        if (institution) {
          return
        }
        missingEPCI.push(b.code_siren)
      })
      if (missingEPCI.length) {
        console.log(
          "Incitation covoiturage sans institution reliée - ",
          missingEPCI.map((b) => `code_siren : ${b}`).join("\n")
        )
      }
      expect(missingEPCI.length).toEqual(0)
    }
  })

  it("All benefitsCovoiturage should have an existing institution that is not 'autre' type", function () {
    if (benefitsCovoiturage.length) {
      const institutions = Object.values(benefits.institutionsMap)
      const institutionAutre: Institution[] = []
      benefitsCovoiturage.forEach((b) => {
        const institution = institutions.find(
          (i) => i.code_siren === b.code_siren
        )
        if (institution && "autre" === institution.type) {
          institutionAutre.push(institution)
        }
      })
      if (institutionAutre.length) {
        console.log(
          "Incitation covoiturage reliée à une institution autre, il faut faire une incitation covoiturage manuelle/yaml\n",
          institutionAutre
            .map((i) => `- nom : ${i.label} / code_siren : ${i.code_siren}`)
            .join("\n")
        )
      }
      expect(institutionAutre.length).toEqual(0)
    }
  })
})
