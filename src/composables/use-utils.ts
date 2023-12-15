import { capitalize } from "@lib/utils.js"

export default function useUtils() {
  const capitalizeString = (label) => capitalize(label)
  const isBoolean = (val) => typeof val === "boolean"
  const isEmpty = (array) => array.length === 0
  const isNumber = (val) => typeof val === "number"
  const isString = (val) => typeof val === "string"

  return {
    capitalizeString,
    isBoolean,
    isEmpty,
    isNumber,
    isString,
  }
}
