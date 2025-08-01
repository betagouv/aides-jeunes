import { ref } from "vue"
import { useStore } from "@/stores/index.js"
import Simulations from "@/lib/simulation.js"
import axios from "axios"

type Coordinates = [number, number]

export function useVolontaryOrganisations() {
  const store = useStore()

  const volontaryOrganisationsLink = ref<string>("")
  const updating = ref<boolean>(true)

  const fetchPostalCodeFromStore = async (): Promise<string> => {
    let postalCode = store.situation.menage._codePostal

    const simulationId = Simulations.getLatestId()
    if (!store.hasResults && !postalCode && simulationId) {
      await store.fetch(simulationId)
      postalCode = store.situation.menage._codePostal
    }
    return postalCode
  }

  const fetchCenterCoordinatesFromPostalCode = async (
    postalCode,
  ): Promise<Coordinates> => {
    const response = await axios.get(
      `/api/outils/codePostal/${postalCode}/centerCoordinates`,
    )
    const centerCoordinates: Coordinates = response.data

    const hasValidCoordinates =
      centerCoordinates && centerCoordinates.length === 2

    if (!hasValidCoordinates) {
      throw new Error(
        `Can't find center coordinates for this postal code ${postalCode}`,
      )
    }
    return centerCoordinates
  }

  async function buildVolontaryOrganisationsLink() {
    const baseUrl = "https://www.jeveuxaider.gouv.fr/organisations"
    try {
      const postalCode: string = await fetchPostalCodeFromStore()

      if (!postalCode) {
        throw new Error("Can't find postal code")
      }

      const centerCoordinates: Coordinates =
        await fetchCenterCoordinatesFromPostalCode(postalCode)

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
