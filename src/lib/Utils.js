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
  return `${value}\xa0€`
}

export const displayDepcomValue = (codePostal, nom) => {
  return `${codePostal} (${nom})`
}

export const displayValue = (value, question, component) => {
  if (value === undefined) {
    return value
  }

  switch (question.questionType) {
    case "date":
      return displayDateValue(value)
    case "enum":
      return displayEnumValue(
        value,
        executeFunctionOrReturnValue(question, "items", component)
      )
    case "number":
      return question.unit ? `${value} ${question.unit}` : value
    case undefined:
      return displayYesNoValue(value)
  }
}
