var haversine = require("haversine")

var communesMap = require("communes-lonlat").reduce((map, item) => {
  map[item.code] = item
  return map
}, {})

const processing = {
  hasArrondissements(inseeCode) {
    if (inseeCode) {
      if (inseeCode.startsWith("132")) {
        return 13055
      }
      if (inseeCode.startsWith("693")) {
        return 69123
      }
      if (inseeCode.startsWith("751")) {
        return 75056
      }
    }
    return inseeCode
  },
}
var origin = communesMap[processing.hasArrondissements(process.argv[2])]
var destination = communesMap[processing.hasArrondissements(process.argv[3])]
console.log(origin)
console.log(destination)
if (origin && destination) {
  const distance = haversine(
    origin.centre.coordinates,
    destination.centre.coordinates,
    { format: "[lon,lat]" }
  )
  console.log(distance)
}
