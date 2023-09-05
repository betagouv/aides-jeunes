import Simulation from "@/lib/simulation.js"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventCategory } from "@lib/enums/event-categories.js"

export default {
  mixins: [StatisticsMixin],
  computed: {
    droits() {
      return this.resultats?.droitsEligibles
    },
    hasDroits() {
      return this.droits.length > 0
    },
    resultatsId() {
      return this.resultats?._id || "???"
    },
    accessStatus() {
      return this.store.access
    },
    resultatStatus() {
      return this.store.calculs
    },
    resultats() {
      return !this.store.calculs.dirty && this.store.calculs.resultats
    },
    hasWarning() {
      return this.accessStatus.forbidden
    },
    hasError() {
      return this.resultatStatus.error
    },
    hasErrorSave() {
      return this.store.saveSituationError
    },
    shouldDisplayResults() {
      return (
        !(this.resultatStatus.updating || this.hasWarning || this.hasError) &&
        this.droits
      )
    },
    ressourcesYearMinusTwoCaptured() {
      return this.store.ressourcesYearMinusTwoCaptured
    },
    simulationAnonymized() {
      return this.store.simulationAnonymized
    },
  },
  methods: {
    eligibleBenefits() {
      return (
        !this.store.calculs.dirty &&
        this.store.calculs.resultats.droitsEligibles
      )
    },
    async restoreLatest() {
      const lastestSimulationId = Simulation.getLatestId()
      if (!lastestSimulationId) {
        this.sendEventToMatomo(
          EventCategory.General,
          "redirection",
          this.$route.path
        )

        return this.store.redirection((route) => this.$router.push(route))
      }

      this.sendEventToMatomo(EventCategory.General, "compute", this.$route.path)

      await this.store.fetch(lastestSimulationId)

      if (this.simulationAnonymized) {
        await this.store.retrieveResultsAlreadyComputed()
      } else {
        this.store.computeResults()
      }
    },
    mockResultsNeeded() {
      return this.$route.query.debug !== undefined
    },
    mock(detail) {
      if (this.mockResultsNeeded()) {
        this.store.mockResults(detail || this.$route.query.debug)
      }
    },
    displaySimulationUnavailable() {
      return this.simulationAnonymized && !this.store.followup
    },
  },
}
