import Ajv from "ajv"
import jamstackLoader from "jamstack-loader"
import path from "path"

const __dirname = new URL(".", import.meta.url).pathname

function getData() {
  return jamstackLoader.get(
    path.join(__dirname, "../contribuer/public/admin/json_schema_config.yml")
  )
}

function getValidator(collection, additionalAttributes = {}) {
  const schema = {
    ...collection.schema,
    properties: {
      ...additionalAttributes,
      ...collection.schema.properties,
      slug: {
        type: "string",
        pattern: "[a-z A-Z -_]*",
      },
    },
  }
  const ajv = new Ajv()
  return ajv.compile(schema)
}

export function getSchemaValidator(collectionName, additionalAttributes) {
  const jamstack = getData()
  return getValidator(
    jamstack.collections[collectionName],
    additionalAttributes
  )
}

export function validateSchema(describe, it, expect) {
  describe("YAML file schema", () => {
    const jamstack = getData()
    const collectionNames = Object.keys(jamstack.collections)

    collectionNames.forEach((collectionName) => {
      const collection = jamstack.collections[collectionName]
      const items = collection.items
      describe(collectionName, () => {
        const validator = getValidator(collection)

        items.forEach((doc) => {
          describe(doc.slug, () => {
            it("has a valid schema", () => {
              validator(doc)
              expect(validator.errors).toBeFalsy()
            })
          })
        })
      })
    })
  })
}
