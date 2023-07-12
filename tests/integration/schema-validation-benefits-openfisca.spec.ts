import { expect } from "@jest/globals"
import path from "path"
import fs from "fs"

import { validateFile, getCollectionSchema } from "@root/data/schemas.js"
const benefitSchema = getCollectionSchema("benefits_openfisca")

const dataDir = path.join(new URL(".", import.meta.url).pathname, "../../data")
const benefitFiles = fs
  .readdirSync(`${dataDir}/benefits/openfisca`)
  .filter((filename) => filename.match(/\.yml$/))

describe("Test OpenFisca Benefit schema", function () {
  for (const benefitFilename of benefitFiles) {
    describe(benefitFilename, function () {
      it("should respect OpenFisca Benefit schema", function () {
        expect(
          validateFile(
            `data/benefits/openfisca/${benefitFilename}`,
            benefitSchema
          )
        ).toEqual([])
      })
    })
  }
})
