const path = require("path")
const fs = require("fs")

const schemas = require("../../data/schemas")
const benefitSchema = schemas.getCollectionSchema("benefits_openfisca")

const dataDir = path.join(__dirname, "../../data")
const benefitFiles = fs
  .readdirSync(`${dataDir}/benefits/openfisca`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test OpenFisca Benefit schema", function () {
  for (let benefitFilename of benefitFiles) {
    describe(benefitFilename, function () {
      it("should respect OpenFisca Benefit schema", function () {
        expect(
          schemas.validateFile(
            `data/benefits/openfisca/${benefitFilename}`,
            benefitSchema
          )
        ).toEqual([])
      })
    })
  }
})
