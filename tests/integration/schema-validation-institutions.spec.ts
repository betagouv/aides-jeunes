import { expect } from "vitest"
import fs from "fs"
import path from "path"
import { getCollectionSchema, validateFile } from "@root/data/schemas.js"

const institutionSchema = getCollectionSchema("institutions")

const dataDir = path.resolve(__dirname, "../../data")
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
            institutionSchema,
          ),
        ).toEqual([])
      })
    })
  }
})
