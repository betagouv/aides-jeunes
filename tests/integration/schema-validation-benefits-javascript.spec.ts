import { expect } from "@jest/globals"
import path from "path"
import fs from "fs"

import { validateFile, getCollectionSchema } from "@root/data/schemas.js"
const jsBenefitSchema = getCollectionSchema("benefits_javascript")
const dynamicBenefitSchema = getCollectionSchema("benefits_dynamic")

const dataDir = path.join(new URL(".", import.meta.url).pathname, "../../data")

describe("Test Javascript Benefit schema", function () {
  checkBenefitsSchema(jsBenefitSchema, "javascript")
  checkBenefitsSchema(dynamicBenefitSchema, "reform_dynamic")
})

function getBenefitsFiles(benefitsFolder) {
  const fileNames = fs
    .readdirSync(`${dataDir}/benefits/${benefitsFolder}`)
    .filter((filename) => filename.match(/\.ya?ml$/))

  const filesPath = fileNames.map(
    (fileName) => `data/benefits/${benefitsFolder}/${fileName}`
  )

  return filesPath
}

function checkBenefitsSchema(benefitSchema, benefitsFolder) {
  const benefitFiles = getBenefitsFiles(benefitsFolder)
  for (const benefitFilePath of benefitFiles) {
    describe(benefitFilePath, function () {
      it("should respect Javascript Benefit schema", function () {
        expect(validateFile(benefitFilePath, benefitSchema)).toEqual([])
      })
    })
  }
}
