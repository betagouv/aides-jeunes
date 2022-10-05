import path from "path"
import fs from "fs"
import { getCollectionSchema, validateFile } from "@root/data/schemas"

const institutionSchema = getCollectionSchema("institutions")
const __dirname = new URL(".", import.meta.url).pathname
const dataDir = path.join(__dirname, "../../data")
const institutionFiles = fs
  .readdirSync(`${dataDir}/institutions`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test Institutions schema", function () {
  for (let institutionFilename of institutionFiles) {
    describe(institutionFilename, function () {
      it("should respect institution schema", function () {
        expect(
          validateFile(
            `data/institutions/${institutionFilename}`,
            institutionSchema
          )
        ).toEqual([])
      })
    })
  }
})
