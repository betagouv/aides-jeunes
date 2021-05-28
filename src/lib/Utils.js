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
