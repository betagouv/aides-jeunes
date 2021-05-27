export const returnStringOrExecuteFunction = (obj, name, component) => {
  return obj && obj[name]
    ? obj[name] instanceof String
      ? obj[name]
      : obj[name](component)
    : undefined
}
