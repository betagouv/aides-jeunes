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
    let cityPostcode = store.situation.menage._codePostal
    const simulationId = Simulation.getLatestId()
    if (!store.hasResults && !cityInseeCode && simulationId) {
      await store.fetch(simulationId)
      cityInseeCode = store.situation.menage.depcom
      cityPostcode = store.situation.menage._codePostal
    }

    if (!cityInseeCode) {
      Sentry.captureMessage(`Depcom required to buildVolontaryOrganisations()`)
      updating.value = false
      return
    }
    let centerCoordinates = null
    try {
      const response = await axios.get(
        `/api/outils/communes/${cityPostcode}/centerCoordinates`
      )
      centerCoordinates = response.data
    } catch (error) {
      Sentry.captureMessage(
        `Center coordinates not found for city postcode ${cityPostcode}`
      )
      updating.value = false
      return
    }

    if (!centerCoordinates) {
      updating.value = false
      return
    }
    const cityLong = centerCoordinates[0]
    const cityLat = centerCoordinates[1]

    volontaryOrganisationsLink.value = `https://www.jeveuxaider.gouv.fr/organisations?city=${cityPostcode}&aroundLatLng=${cityLat},${cityLong}`
    updating.value = false
  }

  buildVolontaryOrganisationsLink()

  return {
    updating,
    volontaryOrganisationsLink,
    buildVolontaryOrganisationsLink,
  }
}
