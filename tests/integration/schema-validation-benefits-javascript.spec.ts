import { expect } from "vitest"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { validateFile, getCollectionSchema } from "@root/data/schemas.js"
const benefitSchema = getCollectionSchema("benefits_javascript")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.resolve(__dirname, "../../data")
const benefitFiles = fs
  .readdirSync(`${dataDir}/benefits/javascript`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test Javascript Benefit schema", function () {
  for (const benefitFilename of benefitFiles) {
    describe(benefitFilename, function () {
      it("should respect Javascript Benefit schema", function () {
        expect(
          validateFile(
            `data/benefits/javascript/${benefitFilename}`,
            benefitSchema
          )
        ).toEqual([])
      })
    })
  }
})
