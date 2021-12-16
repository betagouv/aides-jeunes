const communes = require("@etalab/decoupage-administratif/data/communes.json")
const communeCode98 = require("./communeCode98.json")
const epci = require("@etalab/decoupage-administratif/data/epci.json")

const index = {}
let communeEpci

communes.forEach(function (commune) {
  if (!commune.codesPostaux) {
    return
  }

  communeEpci = epci.find((value) =>
    value.membres.some((membre) => membre.code === commune.code)
  )
  // Backward compatibility
  commune.codeCommune = commune.code
  commune.nomCommune = commune.nom
  commune.epci = communeEpci[0] && communeEpci[0].code

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
