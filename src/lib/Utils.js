export const returnStringOrExecuteFunction = (obj, name, component) => {
  return obj && obj[name]
    ? typeof obj[name] == "string"
      ? obj[name]
      : obj[name](component)
    : undefined
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
