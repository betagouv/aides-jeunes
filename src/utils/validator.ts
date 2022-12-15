export function stringIsValidNumber(value, min = null, max = null) {
  value = value.replaceAll(/\s/g, "")
  // regex:
  // ^(-)?              may start with a minus sign
  // (\d)+              as at least one digit
  //  ((\.|,)(\d)+)     if it as dot or a comma, it needs to be follow by at least a digit
  const validNumber =
    value.match(/^(-)?(\d)+((\.|,)(\d)+)?$/g) && !isNaN(parseFloat(value))
  const floor = min == null || min <= parseFloat(value)
  const ceiling = max == null || max >= parseFloat(value)
  return validNumber && floor && ceiling
}

export function stringToNumber(value) {
  value = value === "" ? "0" : value
  const trailingZeros = value.match(/(\.|,)0+$/)
  if (trailingZeros) {
    return parseFloat(value).toFixed(trailingZeros.length - 1)
  } else {
    return parseFloat(value)
  }
}
