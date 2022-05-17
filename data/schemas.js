const path = require("path")
const { get } = require("jamstack-loader")
const jamstack = get(
  path.join(__dirname, "../contribuer/public/admin/config.yml")
)
const yaml = require("js-yaml")
const fs = require("fs")

const typesMap = {
  select: "string",
  image: "string",
  institution: "string",
  description: "string",
}

function getFieldType(field) {
  if (field.widget == "hidden") {
    console.log(typesMap[field.widget] ? typesMap[field.widget] : field.widget)
  }
  return typesMap[field.widget] ? typesMap[field.widget] : field.widget
}

function generateSchema(fields) {
  let schema = {}
  for (let field of fields) {
    let line = {
      type: getFieldType(field),
      required: field.required === false ? false : true,
    }
    if (
      field.widget == "list" ||
      field.widget == "object" ||
      field.types ||
      field.fields ||
      field.type ||
      (field.widget == "hidden" && field.type == "list")
    ) {
      if (field.types) {
        schema[field.name] = [generateSchema(field.types)]
      } else if (field.fields) {
        schema[field.name] = generateSchema(field.fields)
      } else if (field.type) {
        schema[field.name] = generateSchema(field.type)
      } else {
        schema[field.name] = [line]
      }
    } else {
      schema[field.name] = line
    }
  }
  return schema
}

function compareSchema(data, schema, output) {
  const schemaKeys = Object.keys(schema)
  for (let key in data) {
    if (schemaKeys.includes(key)) {
      if (
        typeof data[key] !== schema[key].type &&
        schema[key].type != "hidden" &&
        !["array", "object"].includes(typeof data[key])
      ) {
        output.push({
          path: `${key}`,
          message: `${key} is of type ${typeof data[key]}, ${
            schema[key].type
          } expected in schema`,
        })
      }
    } else {
      output.push({
        path: `${key}`,
        message: `${key} is not present in schema`,
      })
    }
  }
  const dataKeys = Object.keys(data)
  for (let key in schema) {
    if (!dataKeys.includes(key) && schema[key].required == true) {
      output.push({
        path: `${key}`,
        message: `${key} field is missing`,
      })
    }
  }
}

function validateFile(filename, schema) {
  const file = yaml.load(
    fs.readFileSync(path.join(__dirname, `../${filename}`))
  )
  const output = []
  compareSchema(file, schema, output)
  return output
}

function getCollectionSchema(collection) {
  return generateSchema(jamstack.collections[collection].fields)
}

module.exports = { getCollectionSchema, validateFile }
