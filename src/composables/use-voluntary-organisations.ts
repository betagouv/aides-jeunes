import { ref } from "vue"
import { useStore } from "@/stores/index.js"
import * as Sentry from "@sentry/vue"
import Simulation from "@/lib/simulation.js"
import communesLonLat from "communes-lonlat"

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

    const longLat = communesLonLat.find(
      (commune) => commune.code === cityInseeCode
    )

    if (!longLat) {
      Sentry.captureMessage(
        `LongLat not found for cityInseeCode ${cityInseeCode}`
      )
      updating.value = false
      return
    }
    const cityLong = longLat.centre.coordinates[0]
    const cityLat = longLat.centre.coordinates[1]

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
