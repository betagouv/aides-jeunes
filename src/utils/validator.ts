export function isValidNumber(value, min = null, max = null) {
  const validNumber =
    value.match(/^(-)?(\d)+((\.|,)(\d)+)?$/g) && !isNaN(parseFloat(value))
  const floor = min == null || min <= parseFloat(value)
  const ceiling = max == null || max >= parseFloat(value)
  return validNumber && floor && ceiling
}
