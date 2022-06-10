const moment = require("moment")

const executeFunctionOrReturnValue = (obj, name, component) => {
  return obj?.[name]
    ? typeof obj[name] == "function"
      ? obj[name](component)
      : obj[name]
    : undefined
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const yearsAgo = (years, date, format = "MMMM YYYY") => {
  let dt = moment(date)
  return date && dt.subtract(years, "years").format(format)
}

const displayDateValue = (value) => {
  return moment(value).format("DD MMMM YYYY")
}

const displayEnumValue = (value, items) => {
  const result = items.find((item) => item.value === value)
  return result?.label
}

const displayMultipleValue = (value, question) => {
  return value
    .map((item) => {
      for (let answer of question.items) {
        if (item == answer.value) {
          return answer.label
        }
      }
    })
    .join(", ")
}

const displayYesNoValue = (value) => {
  return value ? "Oui" : "Non"
}

const displayCurrencyValue = (value) => {
  return `${value}\xa0€`
}

const displayDepcomValue = (codePostal, nom) => {
  return `${codePostal} (${nom})`
}

const displayValue = (value, question, component) => {
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

module.exports = {
  executeFunctionOrReturnValue,
  capitalize,
  yearsAgo,
  displayDateValue,
  displayEnumValue,
  displayMultipleValue,
  displayYesNoValue,
  displayCurrencyValue,
  displayDepcomValue,
  displayValue,
}
