const {
  findCommuneByInseeCode,
  computeDistanceCommunes,
} = require("./backend/lib/mes-aides/distance.js")
const origin = findCommuneByInseeCode(process.argv[2])
const destination = findCommuneByInseeCode(process.argv[3])

console.log(origin)
console.log(destination)
const distance = computeDistanceCommunes(origin, destination)
console.log(distance)
