const communes = require("@etalab/decoupage-administratif/data/communes.json")

function isGeographicallyIncluded(codeInsee, institution) {
  return true // false
}

module.exports = {
  isGeographicallyIncluded,
}
