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

function getFieldType(field) {
  return typesMap[field.widget] ? typesMap[field.widget] : field.widget
}

function generateSchema(fields) {
  let schema = {}
  for (let field of fields) {
    let line = {
      type: getFieldType(field),
      required: field.required === false ? false : true,
    }
    if (field.fields) {
      schema[field.name] = generateSchema(field.fields)
    } else if (
      field.widget == "list" ||
      field.widget == "object" ||
      field.types ||
      field.type ||
      (field.widget == "hidden" && field.type == "list")
    ) {
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

function errorLogger(field, value, expectedType, depth) {
  return {
    path: `${depth.join(".")}${depth.length ? "." : ""}${field}`,
    message: `${field} is of type ${typeof value}, ${expectedType} expected in schema`,
  }
}

function compareSchema(data, schema, output, depth = []) {
  /*
    compareSchema works as follow:
    - first loop:
        - makes sure that every key in the data is in the schema
        - don't take into account "hidden" type key, since their format isn't controlled
        - if the type of the data key is an object, recursively call compareSchema
    - second loop : make sure that the data is not missing a field
  */
  const schemaKeys = Object.keys(schema)
  for (let key in data) {
    if (schemaKeys.includes(key)) {
      if (
        typeof data[key] !== schema[key].type &&
        data[key] !== null &&
        schema[key].type != "hidden" &&
        typeof schema[key].type !== "undefined" &&
        typeof schema[key].type !== "object"
      ) {
        output.push(errorLogger(key, data[key], schema[key].type, depth))
      }
      if (typeof data[key] == "object" && schema[key].type != "hidden") {
        if (data[key] instanceof Array) {
          if (schema[key] instanceof Array) {
            const types = schema[key].map((field) => field.type)
            for (let i in data[key]) {
              if (!types.includes(typeof data[key][i])) {
                output.push(
                  errorLogger(i, data[key][i], types.join(", "), depth)
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
        } else if (data[key] != null) {
          compareSchema(data[key], schema[key], output, [...depth, key])
        }
      }
    } else {
      output.push({
        path: `${depth.join(".")}${depth.length ? "." : ""}${key}`,
        message: `${key} is not present in schema`,
      })
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
