import { ref } from "vue"
import { useStore } from "@/stores/index.js"
import Simulations from "@/lib/simulation.js"
import axios from "axios"

type Coordinates = [number, number]

interface GeoAPIResponse {
  type: string
  version: string
  features: Array<{
    type: string
    geometry: {
      type: string
      coordinates: [number, number]
    }
    properties: {
      label: string
      score: number
      type: string
      postcode: string
      citycode: string
      city: string
    }
  }>
}

export function useVolontaryOrganisations() {
  const store = useStore()

  const volontaryOrganisationsLink = ref<string>("")
  const updating = ref<boolean>(true)

  const fetchPostalCodeFromStore = async (): Promise<[string, string]> => {
    let postalCode = store.situation.menage._codePostal
    let depcom = store.situation.menage.depcom

    const simulationId = Simulations.getLatestId()
    if (!store.hasResults && !postalCode && simulationId) {
      await store.fetch(simulationId)
      postalCode = store.situation.menage._codePostal
      depcom = store.situation.menage.depcom
    }
    return [postalCode!, depcom!]
  }

  const fetchCenterCoordinatesFromPostalCode = async (
    postalCode: string,
    depcom
  ): Promise<Coordinates> => {
    const response = await axios.get<GeoAPIResponse>(
      `https://api-adresse.data.gouv.fr/search/?&q=mairie&citycode=${depcom}&limit=1`
    )

    const features = response.data.features
    if (!features || features.length === 0) {
      throw new Error(
        `Can't find center coordinates for this postal code ${postalCode}`
      )
    }

    return features[0].geometry.coordinates
  }

  async function buildVolontaryOrganisationsLink() {
    const baseUrl = "https://www.jeveuxaider.gouv.fr/organisations"
    try {
      const [postalCode, depcom] = await fetchPostalCodeFromStore()

      if (!postalCode || !depcom) {
        throw new Error("Can't find postal code or depcom")
      }

      const centerCoordinates: Coordinates =
        await fetchCenterCoordinatesFromPostalCode(postalCode, depcom)

      volontaryOrganisationsLink.value = `${baseUrl}?city=${postalCode}&aroundLatLng=${centerCoordinates[1]},${centerCoordinates[0]}`

      updating.value = false
    } catch (error) {
      volontaryOrganisationsLink.value = baseUrl
      updating.value = false
      console.error("Error: link build with JeVeuxAider " + error)
    }
  }

  buildVolontaryOrganisationsLink()

  return {
    updating,
    volontaryOrganisationsLink,
    buildVolontaryOrganisationsLink,
  }
}
