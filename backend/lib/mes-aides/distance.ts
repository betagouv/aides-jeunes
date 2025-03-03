import haversine from "haversine"

interface Commune {
  centre: {
    coordinates: [number, number]
  }
}

interface GeoAPIResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number]
    }
  }>
}

async function getCommuneCoordinates(
  inseeCode: string
): Promise<Commune | null> {
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${inseeCode}&citycode=${inseeCode}&limit=1`
    )

    if (!response.ok) {
      console.error(
        `Erreur HTTP: ${response.status} for ${inseeCode} insee code`
      )
      return null
    }

    const data: GeoAPIResponse = await response.json()

    if (!data.features || data.features.length === 0) {
      console.error(`no data found for ${inseeCode} insee code`)
      return null
    }

    return {
      centre: {
        coordinates: data.features[0].geometry.coordinates,
      },
    }
  } catch (error) {
    console.error(`Error while getting coordinates for ${inseeCode}:`, error)
    return null
  }
}

export function computeDistanceCommunes(origin, destination) {
  if (origin?.centre && destination?.centre) {
    return haversine(
      origin.centre.coordinates,
      destination.centre.coordinates,
      { format: "[lon,lat]" }
    )
  }
  return 0
}

function processArrondissements(inseeCode: string): string {
  if (inseeCode) {
    if (inseeCode.startsWith("132")) {
      return "13055"
    }
    if (inseeCode.startsWith("693")) {
      return "69123"
    }
    if (inseeCode.startsWith("751")) {
      return "75056"
    }
  }
  return inseeCode
}

export async function findCommuneByInseeCode(
  inseeCode: string
): Promise<Commune | null> {
  inseeCode = processArrondissements(inseeCode)
  return getCommuneCoordinates(inseeCode)
}
