const path = require("path")
const fs = require("fs")
//const validateSchema = require("yaml-schema-validator")

const schemas = require("../../data/schemas")
const institutionSchema = schemas.getCollectionSchema("institutions")

const dataDir = path.join(__dirname, "../../data")
const institutionFiles = fs
  .readdirSync(`${dataDir}/institutions`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test Institutions schema", function () {
  for (let institutionFilename of institutionFiles) {
    describe(institutionFilename, function () {
      it("should respect institution schema", function () {
        expect(
          schemas.validateFile(
            `data/institutions/${institutionFilename}`,
            institutionSchema
          )
          /*
          validateSchema(`${dataDir}/institutions/${institutionFilename}`, {
            schema: institutionSchema,
            logLevel: "none",
          })
          */
        ).toEqual([])
      })
    })
  }
})
