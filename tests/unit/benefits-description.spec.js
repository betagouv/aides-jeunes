const expect = require("expect")
const fs = require("fs")
const regions = require("@etalab/decoupage-administratif/data/regions.json")
const departements = require("@etalab/decoupage-administratif/data/departements.json")
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const epcis = require("@etalab/decoupage-administratif/data/epci.json")

const codesRegion = []
const codesDepartement = []
const codesCommune = []
const codesEpci = []

regions.forEach((region) => {
  codesRegion.push(region.code)
})
departements.forEach((departement) => {
  codesDepartement.push(departement.code)
})
communes.forEach((commune) => {
  codesCommune.push(commune.code)
})
epcis.forEach((epci) => {
  codesEpci.push(epci.code)
})

const codesInstitutions = {
  region: codesRegion,
  departement: codesDepartement,
  commune: codesCommune,
  epci: codesEpci,
}

describe("benefit descriptions", function () {
  const subject = require("../../data/all")

  Object.keys(subject.institutionsMap).forEach(function (institutionSlug) {
    describe(institutionSlug, function () {
      const institution = subject.institutionsMap[institutionSlug]

      it("should have a correct slug", function () {
        expect(Boolean(institutionSlug.match(/[a-z A-Z \-_]*/))).toBe(true)
      })

      if (
        institution.type == "departement" ||
        institution.type == "region" ||
        institution.type == "commune"
      ) {
        it("should have a code_insee", function () {
          expect(typeof institution.code_insee).toBe("string")
          expect(institution.code_insee.length).toBeGreaterThan(1)
        })

        it("should have a relevant code_insee", function () {
          expect(codesInstitutions[institution.type]).toContain(
            institution.code_insee
          )
        })
      }

      if (institution.type == "epci") {
        it("should have a code_siren", function () {
          expect(typeof institution.code_siren).toBe("string")
          expect(institution.code_siren).toMatch(/^(1|2){1}[0-9]{8}$/)
        })

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

      it("should have a label", function () {
        expect(typeof institution.label).toBe("string")
        expect(institution.label.length).toBeGreaterThan(1)
      })

      it("should refer to a img file that exists", function () {
        const path = `${__dirname}/../../public/${institution.imgSrc}`
        expect(fs.existsSync(path)).toBe(true)
      })

      it("should have a type", function () {
        expect(typeof institution.type).toBe("string")
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

          it("should have a correct id", function () {
            expect(Boolean(benefitId.match(/[a-z A-Z \-_]*/))).toBe(true)
          })

          it("should have a label", function () {
            expect(typeof benefit.label).toBe("string")
            expect(benefit.label.length).toBeGreaterThan(1)
          })

          it("should have a description", function () {
            expect(typeof benefit.description).toBe("string")
            const p = document.createElement("p")
            p.innerHTML = benefit.description
            const innerText = p.textContent
            expect(innerText.length).toBeGreaterThanOrEqual(10)
            expect(innerText.length).toBeLessThanOrEqual(420)
          })

          it("should have a link", function () {
            expect(typeof benefit.link).toBe("string")
            expect(benefit.link).toMatch(/^https?:\/\//)
          })

          if (benefit.conditions) {
            describe("conditions", function () {
              benefit.conditions.forEach((condition) => {
                describe(`condition: '${condition}'`, function () {
                  it("should end with a comma.", function () {
                    expect(condition).toMatch(/\.$/)
                  })
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
              const complexGeoCriteriaBenefits = [
                "grand-est-passetudes",
                "hauts-de-france-mon-abo-etudiant-ter",
                "region-ile-de-france-vehicules-propres",
                "region-pays-de-la-loire-ehop-emploi",
              ]
              if (!complexGeoCriteriaBenefits.includes(benefit.id)) {
                it("should have a coherent geographical constraint", function () {
                  const conditionGeo = benefit.conditions_generales.find(
                    (condition) => {
                      return (
                        condition.type === "regions" ||
                        condition.type === "departements" ||
                        condition.type === "communes"
                      )
                    }
                  )
                  expect(conditionGeo.values.length).toEqual(1)
                  expect(conditionGeo.type.slice(0, -1)).toEqual(
                    benefit.institution.type
                  )
                  expect(conditionGeo.values).toEqual([
                    benefit.institution.code_insee,
                  ])
                })
              }
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
