import moment from "moment"

export const executeFunctionOrReturnValue = (obj, name, component) => {
  return obj && obj[name]
    ? typeof obj[name] == "function"
      ? obj[name](component)
      : obj[name]
    : undefined
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const isRelevant = (items, component) => {
  return items.filter((item) => !item.isRelevant || item.isRelevant(component))
}

export const yearsAgo = (years, date, format = "MMMM YYYY") => {
  let dt = moment(date)
  return date && dt.subtract(years, "years").format(format)
}

export const displayDateValue = (value) => {
  return moment(value).format("DD MMMM YYYY")
}

export const displayEnumValue = (value, items) => {
  const result = items.find((item) => item.value === value)
  return result && result.label
}

export const displayYesNoValue = (value) => {
  return value ? "Oui" : "Non"
}

export const displayCurrencyValue = (value) => {
  return `${value}€`
}

export const displayDepcomValue = (codePostal, nom) => {
  return `${codePostal} (${nom})`
}

export const displayValue = (value, question, component) => {
  if (value === undefined) return value
  let result

  switch (question.questionType) {
    case "date":
      result = displayDateValue(value)
      break
    case "enum":
      result = displayEnumValue(
        value,
        executeFunctionOrReturnValue(question, "items", component)
      )
      break
    case "number":
      result = `${value}${question.unit}`
      break
    case undefined:
      result = displayYesNoValue(value)
      break
  }
  return result
}
