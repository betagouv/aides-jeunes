import path from "path"
import yaml from "js-yaml"
import fs from "fs"
import jamstackLoader from "jamstack-loader"
const __dirname = new URL(".", import.meta.url).pathname
const jamstack = jamstackLoader.get(
  path.join(__dirname, "../contribuer/public/admin/config.yml")
)

const typesMap = {
  select: "string",
  image: "string",
  institution: "string",
  description: "string",
  list: "string",
  hidden: "hidden",
}

function generateSchema(fields) {
  const schema = {}
  for (const field of fields) {
    const line = {
      type: typesMap[field.widget] ? typesMap[field.widget] : field.widget,
      required: field.required === false ? false : true,
      allowedValues: undefined,
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
      if (field.widget == "select") {
        line.allowedValues = field.options.map((option) =>
          option.value ? option.value : option
        )
      }
    }
  }
  return schema
}

function errorLogger(
  field,
  depth = [],
  value?: any,
  expectedType?: any,
  expectedValues?: any
) {
  if (expectedValues) {
    return {
      path: `${depth.join(".")}${depth.length ? "." : ""}${field}`,
      message: `${field} value is ${value}; either [${expectedValues.join(
        ", "
      )}] expected in schema`,
    }
  }
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

export function compareSchema(data, schema, output, depth: any = []) {
  // Disable schema validation for file with specific key
  if (data?.skip_schema_check) return

  // Check that every field in the schema is in the data and of the specified type
  const schemaKeys = Object.keys(schema)
  for (const key in data) {
    if (schemaKeys.includes(key) && schema[key].type != "hidden") {
      if (typeof data[key] == "object") {
        // if the field contains other field, check them recursively
        // if the field is an array, check each item against a list of possible fields
        if (data[key] instanceof Array) {
          if (schema[key] instanceof Array) {
            const types = schema[key].map((field) => field.type)
            for (const i in data[key]) {
              if (!types.includes(typeof data[key][i])) {
                output.push(
                  errorLogger(i, depth, data[key][i], types.join(", "))
                )
              }
            }
          } else {
            for (const subkey of data[key]) {
              if (typeof subkey == "object" && subkey["type"]) {
                const proxy = {}
                proxy[subkey["type"]] = subkey["values"]
                compareSchema(proxy, schema[key], output, [...depth, key])
              }
            }
          }
          // if the field is an object, check each key separately
        } else if (data[key] != null) {
          compareSchema(data[key], schema[key], output, [...depth, key])
        }
      } else if (
        typeof data[key] !== schema[key].type && // compare type with expected type
        !["string", "number"].includes(typeof data[key]) && // number in file can be a string or number in schema
        data[key] !== null && // in case the field was unset in netlify CMS
        schema[key].type != "hidden" && // don't check hidden fields
        typeof schema[key].type !== "undefined" // skip array check
      ) {
        output.push(errorLogger(key, depth, data[key], schema[key].type))
      } else if (
        schema[key].allowedValues && // if only specific values are allowed for this field
        !schema[key].allowedValues.includes(data[key]) &&
        !(
          // in case value is a string
          (
            typeof data[key] === "string" &&
            schema[key].allowedValues.includes(data[key].trim())
          )
        )
      ) {
        output.push(
          errorLogger(
            key,
            depth,
            data[key],
            schema[key].type,
            schema[key].allowedValues
          )
        )
      }
      // if the field is not in the schema
    } else if (typeof schema[key]?.type === "undefined") {
      output.push(errorLogger(key, depth))
    }
  }

  const dataKeys = Object.keys(data)
  for (const key in schema) {
    if (
      !dataKeys.includes(key) &&
      schema[key].type != "hidden" &&
      schema[key].required &&
      !(schema instanceof Array)
    ) {
      output.push({
        path: `${depth.join(".")}${depth.length ? "." : ""}${key}`,
        message: `${key} field is missing`,
      })
    }
  }
}

export function validateFile(filename, schema) {
  const file = yaml.load(
    fs.readFileSync(path.join(__dirname, `../${filename}`))
  )
  const output = []
  compareSchema(file, schema, output)
  return output
}

export function getCollectionSchema(collection) {
  return generateSchema(jamstack.collections[collection].fields)
}
