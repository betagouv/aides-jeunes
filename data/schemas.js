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
  list: "string",
  hidden: "hidden",
}

function generateSchema(fields) {
  let schema = {}
  for (let field of fields) {
    let line = {
      type: typesMap[field.widget] ? typesMap[field.widget] : field.widget,
      required: field.required === false ? false : true,
    }
    if (field.fields) {
      schema[field.name] = generateSchema(field.fields)
    } else if (["list", "object"].includes(field.widget)) {
      if (field.types) {
        schema[field.name] = generateSchema(field.types)
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

function errorLogger(field, depth = [], value, expectedType) {
  if (value && expectedType) {
    return {
      path: `${depth.join(".")}${depth.length ? "." : ""}${field}`,
      message: `${field} is of type ${typeof value}, ${expectedType} expected in schema`,
    }
  } else {
    return {
      path: `${depth.join(".")}${depth.length ? "." : ""}${field}`,
      message: `${field} is not present in schema`,
    }
  }
}

function compareSchema(data, schema, output, depth = []) {
  // Check that every field in the schema is in the data and of the specified type
  const schemaKeys = Object.keys(schema)
  for (let key in data) {
    if (schemaKeys.includes(key) && schema[key].type != "hidden") {
      if (
        typeof data[key] !== schema[key].type && // compare type with expected type
        data[key] !== null && // in case the field was unset in netlify CMS
        schema[key].type != "hidden" && // don't check hidden fields
        typeof schema[key].type !== "undefined" && // skip array check
        typeof schema[key].type !== "object" // don't check object
      ) {
        output.push(errorLogger(key, depth, data[key], schema[key].type))
      } else if (typeof data[key] == "object") {
        // if the field contains other field, check them recursively
        // if the field is an array, check each item against a list of possible fields
        if (data[key] instanceof Array) {
          if (schema[key] instanceof Array) {
            const types = schema[key].map((field) => field.type)
            for (let i in data[key]) {
              if (!types.includes(typeof data[key][i])) {
                output.push(
                  errorLogger(i, depth, data[key][i], types.join(", "))
                )
              }
            }
          } else {
            for (let subkey of data[key]) {
              if (typeof subkey == "object" && subkey["values"]?.length) {
                let proxy = {}
                proxy[subkey["type"]] = subkey["values"]
                compareSchema(proxy, schema[key], output, [...depth, key])
              }
            }
          }
          // if the field is an object, check each key separately
        } else if (data[key] != null) {
          compareSchema(data[key], schema[key], output, [...depth, key])
        }
      }
      // if the field is not in the schema
    } else if (typeof schema[key]?.type === "undefined") {
      output.push(errorLogger(key, depth))
    }
  }

  const dataKeys = Object.keys(data)
  for (let key in schema) {
    if (
      !dataKeys.includes(key) &&
      schema[key].type != "hidden" &&
      schema[key].required == true &&
      !(schema instanceof Array)
    ) {
      output.push({
        path: `${depth.join(".")}${depth.length ? "." : ""}${key}`,
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
