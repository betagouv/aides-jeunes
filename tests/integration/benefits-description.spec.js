import expect from "expect"
import fs from "fs"

import regions from "@etalab/decoupage-administratif/data/regions.json"
import departements from "@etalab/decoupage-administratif/data/departements.json"
import communes from "@etalab/decoupage-administratif/data/communes.json"
import epcis from "@etalab/decoupage-administratif/data/epci.json"

import subject from "@root/data/all"

const __dirname = new URL(".", import.meta.url).pathname
const codesInstitutions = {
  region: regions.map((region) => region.code),
  departement: departements.map((departement) => departement.code),
  commune: communes.map((commune) => commune.code),
  epci: epcis.map((epci) => epci.code),
}

describe("benefit descriptions", function () {
  Object.keys(subject.institutionsMap).forEach(function (institutionSlug) {
    describe(institutionSlug, function () {
      const institution = subject.institutionsMap[institutionSlug]

      if (
        institution.type == "departement" ||
        institution.type == "region" ||
        institution.type == "commune"
      ) {
        it("should have a relevant code_insee", function () {
          expect(codesInstitutions[institution.type]).toContain(
            institution.code_insee
          )
        })
      } else if (institution.type == "epci") {
        it("should have a relevant code_siren", function () {
          expect(codesInstitutions[institution.type]).toContain(
            institution.code_siren
          )
        })
      }

      it("should have an id", function () {
        expect(typeof institution.id).toBe("string")
        expect(institution.id.length).toBeGreaterThan(1)
      })

      it("should refer to a img file that exists", function () {
        const path = `${__dirname}/../../public/${institution.imgSrc}`
        expect(fs.existsSync(path)).toBe(true)
      })

      institution.benefitsIds.forEach(function (benefitId) {
        describe(benefitId, function () {
          const benefit = subject.benefitsMap[benefitId]

          if (benefit.imgSrc) {
            it("should refer to a img file that exists", function () {
              const path = `${__dirname}/../../public/${benefit.imgSrc}`
              expect(fs.existsSync(path)).toBe(true)
            })
          }

          it("should have a description", function () {
            expect(typeof benefit.description).toBe("string")
            const innerText = benefit.description
              .replace(/<\/?[^>]+>/gi, "")
              .replace(/\s\s+/g, " ")
              .trim()
            expect(innerText.length).toBeGreaterThanOrEqual(10)
            expect(innerText.length).toBeLessThanOrEqual(420)
          })

          if (benefit.description.includes('target="_blank"')) {
            it("should have a title attribute in its description when a link opens in a new window", function () {
              expect(benefit.description.includes("Nouvelle fenêtre")).toBe(
                true
              )
            })
          }

          if (benefit.conditions) {
            describe("conditions", function () {
              benefit.conditions.forEach((condition) => {
                describe(`condition: '${condition}'`, function () {
                  it("should end with a comma.", function () {
                    expect(condition).toMatch(/\.$/)
                  })
                  if (condition.includes('target="_blank"')) {
                    it("should have a title attribute in its conditions when a link opens in a new window", function () {
                      expect(condition.includes("Nouvelle fenêtre")).toBe(true)
                    })
                  }
                })
              })
            })
          }

          it("should have a type", function () {
            expect(typeof benefit.type).toBe("string")
            expect(benefit.type.length).toBeGreaterThan(0)
          })

          if (benefit.type === "bool") {
            it("should not have a legend", function () {
              expect(benefit.legend).toBe(undefined)
            })

            it("should not have a montant", function () {
              expect(benefit.montant).toBe(undefined)
            })
          }

          if (benefit.type === "float") {
            it("should have a periodicite", function () {
              expect(typeof benefit.periodicite).toBe("string")
              expect(benefit.periodicite.length).toBeGreaterThan(0)
            })
          }

          if (benefit.source === "javascript") {
            it("should not have an entity", function () {
              expect(benefit.entity).toBe(undefined)
            })

            if (
              ["region", "departement", "commune", "epci"].includes(
                benefit.institution.type
              )
            ) {
              it("should have a geographical constraint", function () {
                const conditionGeo = benefit.conditions_generales.find(
                  (condition) => {
                    return (
                      condition.type === "regions" ||
                      condition.type === "departements" ||
                      condition.type === "communes" ||
                      condition.type === "epcis" ||
                      condition.type === "attached_to_institution"
                    )
                  }
                )
                expect(typeof conditionGeo.type).toBe("string")
                if (conditionGeo.type !== "attached_to_institution") {
                  expect(conditionGeo.type.length).toBeGreaterThan(1)
                  expect(conditionGeo.values.length).toBeGreaterThan(0)
                }
              })
            }

            if (benefit.type === "float") {
              it("should have a montant", function () {
                expect(typeof benefit.montant).toBe("number")
                expect(benefit.montant).toBeGreaterThan(0)
              })
            }
          } else if (benefit.source === "openfisca") {
            it("should have an entity", function () {
              expect(typeof benefit.entity).toBe("string")
              expect(benefit.entity.length).toBeGreaterThan(0)
            })

            it("should have an openfiscaPeriod", function () {
              expect(typeof benefit.openfiscaPeriod).toBe("string")
              expect(benefit.openfiscaPeriod.length).toBeGreaterThan(0)
            })
          }
        })
      })
    })
  })
})

describe("individual instructionsGenerator", function () {
  describe("cohesion-territoires-conseillers-numeriques-france-services", function () {
    const generator =
      subject.benefitsMap[
        "cohesion-territoires-conseillers-numeriques-france-services"
      ].instructionsGenerator
    it("should exist", function () {
      expect(generator).toBeTruthy()
    })
    it("should generate generic urls", function () {
      expect(generator([])).toMatch(/^https?:\/\//)
    })
    it("should generate generic urls", function () {
      const linkValue = generator("69008")
      expect(linkValue).toMatch(/^https?:\/\/.*address=69008$/)
    })
  })
})
