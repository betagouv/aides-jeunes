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
  list: "array",
  hidden: "hidden",
}

function getFieldType(field) {
  console.log(field)
  //console.log(field.name, "|||||||||||||||", field.widget)
  return typesMap[field.widget] ? typesMap[field.widget] : field.widget
}

function generateSchema(fields) {
  let schema = {}
  //console.log(fields)
  for (let field of fields) {
    let line = {
      type: getFieldType(field),
      required: field.required === false ? false : true,
    }
    if (field.fields) {
      console.log("//", field.fields)
      schema[field.name] = generateSchema(field.fields) // field.fields.map(subField => generateSchema(subField))
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

function compareSchema(data, schema, output, depth = false) {
  /*
    compareSchema works as follow:
    - first loop:
        - makes sure that every key in the data is in the schema
        - don't take into account "hidden" type key, since their format isn't controlled
        - if the type of the data key is an object, recursively call compareSchema
    - second loop : make sure that the data is not missing a field
  */
  if (depth) {
    console.log("////> DATA", data)
    console.log("////> SCHEMA", schema)
  }
  const schemaKeys = Object.keys(schema)
  for (let key in data) {
    if (schemaKeys.includes(key)) {
      if (
        typeof data[key] !== schema[key].type &&
        schema[key].type != "hidden" &&
        typeof schema[key].type !== "undefined" &&
        typeof schema[key].type !== "object"
      ) {
        output.push({
          path: `${key}`,
          message: `${key} is of type ${typeof data[key]}, ${
            schema[key].type
          } expected in schema`,
        })
      }
      if (typeof data[key] == "object" && schema[key].type != "hidden") {
        if (data[key] instanceof Array) {
          //console.log("//>", schema[key])
          if (schema[key] instanceof Array) {
            let types = schema[key].map((field) => field.type)
            for (let subkey of data[key]) {
              if (!types.includes(typeof subkey)) {
                output.push({
                  path: `${key}`,
                  message: `${typeof subkey} invalid`,
                })
              }
            }
          } else {
            for (let subkey of data[key]) {
              compareSchema(subkey, schema[key], output, true)
            }
          }
        } else {
          compareSchema(data[key], schema[key], output)
        }
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
  //console.log(file)
  compareSchema(file, schema, output)
  return output
}

function getCollectionSchema(collection) {
  return generateSchema(jamstack.collections[collection].fields)
}

module.exports = { getCollectionSchema, validateFile }
