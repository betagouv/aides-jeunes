import entities from "@root/backend/lib/definitions"
const { famille, individu, menage, parents } = entities

describe("Tests definitions", function () {
  ;[famille, individu, menage, parents].forEach((entity) => {
    Object.entries(entity).forEach(([fieldName, field]) => {
      describe(fieldName, function () {
        it("should have a type", function () {
          expect(field).not.toBe(undefined)
        })
        if (field.enum) {
          it("should not be empty", function () {
            expect(field.enum?.length).toBeGreaterThan(0)
          })
        }
      })
    })
  })
})
