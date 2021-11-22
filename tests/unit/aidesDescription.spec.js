const expect = require("expect")

describe("benefit descriptions", function () {
  const subject = require("../../data/all")

  Object.keys(subject.groupByInstitution).forEach(function (providerName) {
    describe(providerName, function () {
      const provider = subject.groupByInstitution[providerName]

      it("should have a correct id", function () {
        expect(Boolean(providerName.match(/[a-z A-Z \-_]*/))).toBe(true)
      })

      it("should have a label", function () {
        expect(typeof provider.label).toBe("string")
        expect(provider.label.length).toBeGreaterThan(1)
      })

      Object.keys(provider.prestations).forEach(function (aideName) {
        describe(aideName, function () {
          const aide = provider.prestations[aideName]

          it("should have a correct id", function () {
            expect(Boolean(aideName.match(/[a-z A-Z \-_]*/))).toBe(true)
          })

          it("should have a label", function () {
            expect(typeof aide.label).toBe("string")
            expect(aide.label.length).toBeGreaterThan(1)
          })

          it("should have a description", function () {
            expect(typeof aide.description).toBe("string")
            const p = document.createElement("p")
            p.innerHTML = aide.description
            const innerText = p.textContent
            expect(innerText.length).toBeGreaterThanOrEqual(10)
            expect(innerText.length).toBeLessThanOrEqual(420)
          })

          it("should have a link", function () {
            expect(typeof aide.link).toBe("string")
            expect(aide.link).toMatch(/^https?:\/\//)
          })

          if (aide.conditions) {
            describe("conditions", function () {
              aide.conditions.forEach((condition) => {
                describe(`condition: '${condition}'`, function () {
                  it("should end with a comma.", function () {
                    expect(condition).toMatch(/\.$/)
                  })
                })
              })
            })
          }

          it("should have a type", function () {
            expect(typeof aide.type).toBe("string")
            expect(aide.type.length).toBeGreaterThan(0)
          })

          if (aide.type === "bool") {
            it("should not have a legend", function () {
              expect(aide.legend).toBe(undefined)
            })

            it("should not have a montant", function () {
              expect(aide.montant).toBe(undefined)
            })
          }

          if (aide.type === "float") {
            it("should have a periodicite", function () {
              expect(typeof aide.periodicite).toBe("string")
              expect(aide.periodicite.length).toBeGreaterThan(0)
            })
          }

          if (aide.computesLocally) {
            it("should not have an entity", function () {
              expect(aide.entity).toBe(undefined)
            })

            if (aide.type === "float") {
              it("should have a montant", function () {
                expect(typeof aide.montant).toBe("number")
                expect(aide.montant).toBeGreaterThan(0)
              })
            }
          } else {
            it("should have an entity", function () {
              expect(typeof aide.entity).toBe("string")
              expect(aide.entity.length).toBeGreaterThan(0)
            })
          }
        })
      })
    })
  })
})
