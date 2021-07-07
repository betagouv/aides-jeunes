var haversine = require("haversine")

var communesMap = require("communes-lonlat").reduce((map, item) => {
  map[item.code] = item
  return map
}, {})


console.log(process.argv)
var origin = communesMap[process.argv[2]]
var destination = communesMap[process.argv[3]]

console.log('origin', origin)
console.log('destination', destination)
if (origin && destination) {
  distance = haversine(
    origin.centre.coordinates,
    destination.centre.coordinates,
    { format: "[lon,lat]" }
  )
  console.log(distance)
}
