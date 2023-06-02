import Simulation from "@/lib/simulation.ts"
import StatisticsMixin from "@/mixins/statistics.ts"
import { SimulationStatusEnum } from "@lib/enums/simulation.ts"

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
      console.log("this.store", this.store)
      console.log(
        "this.resultats",
        this.store.calculs.dirty && this.store.calculs.resultats
      )
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
        !(
          this.resultatStatus.updating ||
          this.hasWarning ||
          this.hasError ||
          this.simulationAnonymized()
        ) && this.droits
      )
    },
    ressourcesYearMinusTwoCaptured() {
      return this.store.ressourcesYearMinusTwoCaptured
    },
  },
  methods: {
    eligibleBenefits() {
      return (
        !this.store.calculs.dirty &&
        this.store.calculs.resultats.droitsEligibles
      )
    },
    restoreLatest() {
      const lastestSimulation = Simulation.getLatest()
      if (!lastestSimulation) {
        this.sendEventToMatomo("General", "redirection", this.$route.path)

        return this.store.redirection((route) => this.$router.push(route))
      }

      this.sendEventToMatomo("General", "compute", this.$route.path)
      this.store.fetch(lastestSimulation).then(() => {
        if (!this.simulationAnonymized()) {
          this.store.compute()
        }
      })

      return lastestSimulation
    },
    mock(detail) {
      if (this.$route.query.debug !== undefined) {
        this.store.mockResults(detail || this.$route.query.debug)
      }
      return this.$route.query.debug !== undefined
    },
    simulationAnonymized() {
      return this.store.simulation.status === SimulationStatusEnum.ANONYMIZED
    },
  },
}
