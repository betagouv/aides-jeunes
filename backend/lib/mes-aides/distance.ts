import haversine from "haversine"
import axios from "axios"

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
    const response = await axios.get<GeoAPIResponse>(
      `https://api-adresse.data.gouv.fr/search/?q=mairie&citycode=${inseeCode}&limit=1`
    )

    const features = response.data.features
    if (!features || features.length === 0) {
      throw new Error(
        `Can't find center coordinates for ${inseeCode} insee code`
      )
    }

    return {
      centre: {
        coordinates: features[0].geometry.coordinates,
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

export async function findCoordinateByInseeCode(
  inseeCode: string
): Promise<Commune | null> {
  inseeCode = processArrondissements(inseeCode)
  return getCommuneCoordinates(inseeCode)
}
