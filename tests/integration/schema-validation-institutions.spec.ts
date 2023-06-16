import path from "path"
import fs from "fs"

import { getCollectionSchema, validateFile } from "@root/data/schemas"
const institutionSchema = getCollectionSchema("institutions")

const dataDir = path.join(new URL(".", import.meta.url).pathname, "../../data")
const institutionFiles = fs
  .readdirSync(`${dataDir}/institutions`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test Institutions schema", function () {
  for (const institutionFilename of institutionFiles) {
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
