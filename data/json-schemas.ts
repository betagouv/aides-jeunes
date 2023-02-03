import Ajv from "ajv"
import fs from "fs"
import jamstackLoader from "jamstack-loader"
import path from "path"
import yaml from "js-yaml"

const __dirname = new URL(".", import.meta.url).pathname

export function validateSchema(describe, it, expect) {
  describe("YAML file schema", () => {
    const jamstack = jamstackLoader.get(
      path.join(__dirname, "../contribuer/public/admin/json_schema_config.yml")
    )
    const ajv = new Ajv()
    const collectionNames = Object.keys(jamstack.collections)
    collectionNames.forEach((collectionName) => {
      const collection = jamstack.collections[collectionName]
      const items = collection.items
      describe(collectionName, () => {
        const schema = {
          ...collection.schema,
          properties: {
            ...collection.schema.properties,
            slug: {
              type: "string",
              pattern: "[a-z A-Z -_]*",
            },
          },
        }
        const validate = ajv.compile(schema)

        items.forEach((doc) => {
          describe(doc.slug, () => {
            it("has a valid schema", () => {
              validate(doc)
              expect(validate.errors).toBeFalsy()
            })
          })
        })
      })
    })
  })
}
