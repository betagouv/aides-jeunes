// @ts-ignore
const communes = require("@etalab/decoupage-administratif/data/communes.json")
const epci = require("@etalab/decoupage-administratif/data/epci.json")

const communesActuelles = communes.filter((c) => c.type === "commune-actuelle")
const communeMap = {}
const indexCodesPostaux = {}

communesActuelles.forEach(function (commune) {
  communeMap[commune.code] = commune

  if (!commune.codesPostaux) {
    return
  }

  // Backward compatibility
  commune.codeCommune = commune.code
  commune.nomCommune = commune.nom

  const codesPostauxUniques = new Set(commune.codesPostaux)
  codesPostauxUniques.forEach(function (codePostal: any) {
    if (!(codePostal in indexCodesPostaux)) {
      indexCodesPostaux[codePostal] = []
    }

    indexCodesPostaux[codePostal].push(commune)
  })
})

epci.forEach(function (epci) {
  epci.membres.forEach((communeMembre) => {
    // commune déléguée
    if (!communeMap[communeMembre.code]) {
      return
    }
    communeMap[communeMembre.code].epci = epci.code
    communeMap[communeMembre.code].epciType = epci.type
  })
})

function find(postalCode) {
  return indexCodesPostaux[postalCode] || []
}

export default {
  find,
  communes: function (req, res) {
    res.send(find(req.params.codePostal))
  },
}
