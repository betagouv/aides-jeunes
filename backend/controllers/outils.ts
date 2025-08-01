import communes from "@etalab/decoupage-administratif/data/communes.json" with { type: "json" }
import epci from "@etalab/decoupage-administratif/data/epci.json" with { type: "json" }
import communesLonLat from "communes-lonlat"
import * as Sentry from "@sentry/node"

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
  centerCoordinatesFromPostalCode: function (req, res) {
    try {
      const postalCode = find(req.params.codePostal)[0].code
      if (!postalCode) {
        throw new Error("Postal code not found")
      }

      const commune = communesLonLat.find((c) => c.code === postalCode)
      if (!commune?.centre?.coordinates) {
        throw new Error("Commune coordinates not found")
      }

      res.send(commune.centre.coordinates)
    } catch (e) {
      Sentry.captureException(e)
      res.status(404).send("Coordinates not found")
    }
  },
}
