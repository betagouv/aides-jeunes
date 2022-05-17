const path = require("path")
const fs = require("fs")

const schemas = require("../../data/schemas")
//const benefitSchema = schemas.getCollectionSchema("benefits_javascript")

const dataDir = path.join(__dirname, "../../data")
const benefitFiles = fs
  .readdirSync(`${dataDir}/benefits/javascript`)
  .filter((filename) => filename.match(/\.yml$/))

const benefitSchema2 = {
  label: { type: "string", required: true },
  institution: { type: "string", required: true },
  description: { type: "string", required: true },
  conditions_generales: {
    type: { type: "string", required: false },
    values: { values: { type: "string", required: false } },
  },
}

const result = schemas.validateFile(
  `data/benefits/javascript/region-normandie-vae.yml`,
  benefitSchema2
)

/*
{
    "age": {"operator":{"type":"string","required":false},
    "value":{"type":"number","required":false}},
    "regions":{"values":{"type":"string","required":false}},
    "departements":{"values":[{"type":"list","required":false}]},
    "communes":{"values":[{"type":"list","required":false}]},
    "regime_securite_sociale":{"includes":{"type":"string","required":false},
    "excludes":{"type":"string","required":false}},
    "quotient_familial":{"floor":{"type":"number","required":false},
    "period":{"type":"string","required":false}},
    "formation_sanitaire_social":{"empty":{"type":"string","required":false}},
    "beneficiaire_rsa":{"empty":{"type":"string","required":false}}
}
*/

/*
const result = validateSchema(`${dataDir}/benefits/javascript/region-normandie-vae.yml`, {
    schema: benefitSchema,
    logLevel: "none",
})
*/

console.log(result)
//console.log(JSON.stringify(benefitSchema.conditions_generales))
//console.log(benefitSchema.conditions_generales)

// describe("Test Javascript Benefit schema", function () {
//   for (let benefitFilename of benefitFiles) {
//     describe(benefitFilename, function () {
//       it("should respect Javascript Benefit schema", function () {
//         expect(
//           validateSchema(`${dataDir}/benefits/javascript/${benefitFilename}`, {
//             schema: benefitSchema,
//             logLevel: "none",
//           })
//         ).toEqual([])
//       })
//     })
//   }
// })
