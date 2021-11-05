const communes = require("@etalab/decoupage-administratif/data/communes.json")
const communeCode98 = require("./communeCode98.json")
const index = {}

communes.forEach(function (commune) {
  if (!commune.codesPostaux) {
    return
  }

  // Backward compatibility
  commune.codeCommune = commune.code
  commune.nomCommune = commune.nom

  commune.codesPostaux.forEach(function (codePostal) {
    if (!(codePostal in index)) {
      index[codePostal] = []
    }

    index[codePostal].push(commune)
  })
})

function find(postalCode) {
  return index[postalCode] || communeCode98[postalCode] || []
}

exports.communes = function (req, res) {
  res.send(find(req.params.codePostal))
}
