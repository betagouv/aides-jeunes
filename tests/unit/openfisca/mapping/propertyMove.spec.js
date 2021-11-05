const subject = require("../../../../backend/lib/openfisca/mapping/propertyMove")
const expect = require("expect")

describe("openfisca mapping property move", function () {
  describe("movePropertyValuesToGroupEntity", function () {
    describe("situation with data", function () {
      const testCase = {
        individus: {
          bob: {
            aide_logement: {
              "2015-01": 12,
            },
            rsa: {
              2015: 42,
            },
          },
        },
        familles: {
          _: {
            parents: ["bob"],
            enfants: [],
          },
        },
        foyers_fiscaux: {},
      }

      it("moves across ressources", function () {
        subject.movePropertyValuesToGroupEntity(testCase)

        expect(testCase.familles._.rsa).toBeTruthy()
        expect(testCase.familles._.aide_logement).toBeTruthy()
        expect(testCase.individus.bob.aide_logement).toBeFalsy()
      })
    })
    describe("situation without data", function () {
      const testCase = {
        individus: {},
        familles: { _: {} },
        foyers_fiscaux: {},
      }
      subject.movePropertyValuesToGroupEntity(testCase)

      it("runs completely", function () {
        expect(testCase.familles._.rsa).toBeFalsy()
      })
    })
  })
})
