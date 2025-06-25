import haversine from "haversine"
import communesLonLat from "communes-lonlat"

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

export function computeDistanceCommunes(origin, destination) {
  if (origin?.centre && destination?.centre) {
    return haversine(
      origin.centre.coordinates,
      destination.centre.coordinates,
      { format: "[lon,lat]" },
    )
  }
  return 0
}

const communes = communesLonLat.reduce((map, item) => {
  map[item.code] = item
  return map
}, {})

export function findCommuneByInseeCode(inseeCode) {
  inseeCode = processArrondissements(inseeCode)
  return communes[inseeCode]
}
