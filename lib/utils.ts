import dayjs from "dayjs"

export function executeFunctionOrReturnValue(obj, name, component) {
  return obj?.[name]
    ? typeof obj[name] == "function"
      ? obj[name](component)
      : obj[name]
    : undefined
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const yearsAgo = (years, date, format = "MMMM YYYY") => {
  return date && dayjs(date).subtract(years, "year").format(format)
}

export const displayDateValue = (value) => {
  return dayjs(value).format("DD MMMM YYYY")
}

export function displayEnumValue(value, items) {
  const result = items.find((item) => item.value === value)
  return result?.label
}

export function displayMultipleValue(value, question) {
  return value
    .map((item) => {
      for (const answer of question.items) {
        if (item == answer.value) {
          return answer.label
        }
      }
    })
    .join(", ")
}

export function displayYesNoValue(value) {
  return value ? "Oui" : "Non"
}

export function displayCurrencyValue(value) {
  return `${value}\xa0€`
}

export function displayDepcomValue(codePostal, nom) {
  return `${codePostal} (${nom})`
}

export function displayValue(value, question, component) {
  if (value === undefined) {
    return value
  }

  switch (question.questionType) {
    case "date":
      return displayDateValue(value)
    case "multiple":
      return displayMultipleValue(value, question)
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
