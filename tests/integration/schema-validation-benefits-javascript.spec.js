import path from "path"
import fs from "fs"
import { validateFile, getCollectionSchema } from "@root/data/schemas"

const benefitSchema = getCollectionSchema("benefits_javascript")
const __dirname = new URL(".", import.meta.url).pathname
const dataDir = path.join(__dirname, "../../data")
const benefitFiles = fs
  .readdirSync(`${dataDir}/benefits/javascript`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test Javascript Benefit schema", function () {
  for (let benefitFilename of benefitFiles) {
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
