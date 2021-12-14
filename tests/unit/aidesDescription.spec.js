const expect = require("expect")
const fs = require("fs")

describe("benefit descriptions", function () {
  const subject = require("../../data/all")

  Object.keys(subject.institutionsMap).forEach(function (institutionId) {
    describe(institutionId, function () {
      const institution = subject.institutionsMap[institutionId]

      it("should have a correct id", function () {
        expect(Boolean(institutionId.match(/[a-z A-Z \-_]*/))).toBe(true)
      })

      it("should have a label", function () {
        expect(typeof institution.label).toBe("string")
        expect(institution.label.length).toBeGreaterThan(1)
      })

      it("should refer to a img file that exists", function () {
        const path = `${__dirname}/../../public/img/${institution.imgSrc}`
        expect(fs.existsSync(path)).toBe(true)
      })

      institution.benefitsIds.forEach(function (benefitId) {
        describe(benefitId, function () {
          const benefit = subject.benefitsMap[benefitId]

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

          if (benefit.computesLocally) {
            it("should not have an entity", function () {
              expect(benefit.entity).toBe(undefined)
            })

            if (benefit.type === "float") {
              it("should have a montant", function () {
                expect(typeof benefit.montant).toBe("number")
                expect(benefit.montant).toBeGreaterThan(0)
              })
            }
          } else {
            it("should have an entity", function () {
              expect(typeof benefit.entity).toBe("string")
              expect(benefit.entity.length).toBeGreaterThan(0)
            })
          }
        })
      })
    })
  })
})
