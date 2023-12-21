import { defineStore } from "pinia"
import { useStore } from "@/stores/index.js"
import { Benefit } from "@data/types/benefits"
import Simulation from "@/lib/simulation.js"
import StatisticsMixin from "@/mixins/statistics"
import { EventAction, EventCategory } from "@lib/enums/event"

export const useResultsStore = defineStore("resultsStore", {
  getters: {
    benefits(): Benefit[] {
      return this.resultats?.droitsEligibles
    },
    hasBenefits() {
      return this.benefits?.length > 0
    },
    fetching() {
      return useStore().access.fetching
    },
    resultats() {
      return !useStore().calculs.dirty && useStore().calculs.resultats
    },
    updating() {
      return useStore().calculs.updating
    },
    hasWarning() {
      return useStore().access.forbidden
    },
    error() {
      return useStore().calculs.error
    },
    exception() {
      return useStore().calculs.exception
    },
    hasErrorSave() {
      return useStore().saveSituationError
    },
    shouldDisplayResults() {
      return !(this.updating || this.hasWarning || this.error) && this.benefits
    },
    simulationAnonymized() {
      return useStore().simulationAnonymized
    },
    mockResultsNeeded() {
      return this.$router.currentRoute.value.query?.debug !== undefined
    },
    isSimulationUnavailable() {
      return this.simulationAnonymized && !useStore().followup
    },
  },
  actions: {
    mock(detail) {
      if (this.mockResultsNeeded) {
        useStore().mockResults(
          detail || this.$router.currentRoute.value.query?.debug
        )
      }
    },
    async restoreLatestSimulation() {
      const lastestSimulationId = Simulation.getLatestId()
      if (!lastestSimulationId) {
        this.sendEventToMatomo(
          EventCategory.General,
          EventAction.Redirection,
          this.$router.currentRoute.value.fullPath
        )

        return useStore().redirection((route) => this.$router.push(route))
      }

      StatisticsMixin.methods.sendEventToMatomo(
        EventCategory.General,
        EventAction.CalculResultatsRestauration,
        this.$router.currentRoute.value.fullPath
      )

      await useStore().fetch(lastestSimulationId)

      if (useStore().simulationAnonymized) {
        await useStore().retrieveResultsAlreadyComputed()
      } else {
        useStore().computeResults()
      }
    },
  },
})
