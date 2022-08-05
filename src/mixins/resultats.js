import Simulation from "../lib/simulation"

export default {
  computed: {
    droits() {
      return this.resultats?.droitsEligibles
    },
    droitsNonEligibles() {
      return (
        (this.droitsNonEligiblesShow && this.resultats?.droitsNonEligibles) ||
        []
      )
    },
    droitsNonEligiblesShown() {
      return this.droitsNonEligibles.filter(
        (i) => i.id === "css_participation_forfaitaire"
      )
    },
    droitsNonEligiblesShow() {
      return this.store.ameliNoticationDone
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
  },
  methods: {
    restoreLatest() {
      const lastestSimulation = Simulation.getLatest()
      if (!lastestSimulation) {
        this.$matomo?.trackEvent("General", "redirection", this.$route.path)
        return this.store.redirection((route) => this.$router.push(route))
      }

      this.$matomo?.trackEvent("General", "compute", this.$route.path)
      this.store.fetch(lastestSimulation).then(() => this.store.compute())

      return lastestSimulation
    },
    mock(detail) {
      if (this.$route.query.debug !== undefined) {
        this.store.mockResults(detail || this.$route.query.debug)
      }
      return this.$route.query.debug !== undefined
    },
  },
}
