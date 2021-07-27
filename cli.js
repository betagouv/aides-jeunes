var {
  findCommuneByInseeCode,
  computeDistanceCommunes,
} = require("./backend/lib/mes-aides/index.js")
var origin = findCommuneByInseeCode(process.argv[2])
var destination = findCommuneByInseeCode(process.argv[3])

console.log(origin)
console.log(destination)
var distance = computeDistanceCommunes(origin, destination)
console.log(distance)
