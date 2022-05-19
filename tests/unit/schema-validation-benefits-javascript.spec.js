const path = require("path")
const fs = require("fs")

const schemas = require("../../data/schemas")
const benefitSchema = schemas.getCollectionSchema("benefits_javascript")

const dataDir = path.join(__dirname, "../../data")
const benefitFiles = fs
  .readdirSync(`${dataDir}/benefits/javascript`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test Javascript Benefit schema", function () {
  for (let benefitFilename of benefitFiles) {
    describe(benefitFilename, function () {
      it("should respect Javascript Benefit schema", function () {
        expect(
          schemas.validateFile(
            `data/benefits/javascript/${benefitFilename}`,
            benefitSchema
          )
        ).toEqual([])
      })
    })
  }
})
