import { ref } from "vue"
import { useStore } from "@/stores/index.js"
import * as Sentry from "@sentry/vue"
import Simulation from "@/lib/simulation.js"
import axios from "axios"

export function useVolontaryOrganisations() {
  const store = useStore()

  const volontaryOrganisationsLink = ref<string>()
  const updating = ref<boolean>(true)

  const buildVolontaryOrganisationsLink = async () => {
    let cityInseeCode = store.situation.menage.depcom
    let cityPostalCode = store.situation.menage._codePostal
    const simulationId = Simulation.getLatestId()
    if (!store.hasResults && !cityInseeCode && simulationId) {
      await store.fetch(simulationId)
      cityInseeCode = store.situation.menage.depcom
      cityPostalCode = store.situation.menage._codePostal
    }

    if (!cityInseeCode) {
      volontaryOrganisationsLink.value = `https://www.jeveuxaider.gouv.fr/organisations`
      updating.value = false
      return
    }
    let centerCoordinatesFromPostalCode = null
    try {
      const response = await axios.get(
        `/api/outils/codePostal/${cityPostalCode}/centerCoordinates`
      )
      centerCoordinatesFromPostalCode = response.data
    } catch (error) {
      Sentry.captureMessage(
        `Center coordinates not found for city postalcode ${cityPostalCode}`
      )
      updating.value = false
      return
    }

    if (!centerCoordinatesFromPostalCode) {
      updating.value = false
      return
    }
    const cityLong = centerCoordinatesFromPostalCode[0]
    const cityLat = centerCoordinatesFromPostalCode[1]

    volontaryOrganisationsLink.value = `https://www.jeveuxaider.gouv.fr/organisations?city=${cityPostalCode}&aroundLatLng=${cityLat},${cityLong}`
    updating.value = false
  }

  buildVolontaryOrganisationsLink()

  return {
    updating,
    volontaryOrganisationsLink,
    buildVolontaryOrganisationsLink,
  }
}
