var expect = require("expect")

describe("benefit descriptions", function () {
  var subject = require("../../app/js/constants/benefits/back")

  const levels = ["prestationsNationales", "partenairesLocaux"]
  levels.forEach((level) => {
    Object.keys(subject[level]).forEach(function (providerName) {
      describe(providerName, function () {
        var provider = subject[level][providerName]

        it("should have a label", function () {
          expect(typeof provider.label).toBe("string")
          expect(provider.label.length).toBeGreaterThan(1)
        })

        Object.keys(provider.prestations).forEach(function (aideName) {
          describe(aideName, function () {
            var aide = provider.prestations[aideName]

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

            if (aide.type !== "bool") {
              describe("should have a periodicite", function () {
                expect(Boolean(aide.periodicite)).toBe(true)
              })
            }
          })
        })
      })
    })
  })
})
