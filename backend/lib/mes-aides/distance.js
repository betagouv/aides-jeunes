var haversine = require("haversine")

const processArrondissements = (inseeCode) => {
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
}

function computeDistanceCommunes(origin, destination) {
  if (origin && destination) {
    return haversine(
      origin.centre.coordinates,
      destination.centre.coordinates,
      { format: "[lon,lat]" }
    )
  }
  return 0
}

const communes = require("communes-lonlat").reduce((map, item) => {
  map[item.code] = item
  return map
}, {})

function findCommuneByInseeCode(inseeCode) {
  inseeCode = processArrondissements(inseeCode)
  return communes[inseeCode]
}

exports.computeDistanceCommunes = computeDistanceCommunes
exports.findCommuneByInseeCode = findCommuneByInseeCode
