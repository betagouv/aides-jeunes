import Simulation from "../lib/simulation"

export default {
  computed: {
    droits: function () {
      return this.resultats?.droitsEligibles
    },
    droitsNonEligibles: function () {
      return (
        (this.droitsNonEligiblesShow && this.resultats?.droitsNonEligibles) ||
        []
      )
    },
    droitsNonEligiblesShown: function () {
      return this.droitsNonEligibles.filter(
        (i) => i.id === "css_participation_forfaitaire"
      )
    },
    droitsNonEligiblesShow: function () {
      return this.$store.state.ameliNoticationDone
    },
    resultatsId: function () {
      return this.resultats?._id || "???"
    },
    accessStatus: function () {
      return this.$store.state.access
    },
    resultatStatus: function () {
      return this.$store.state.calculs
    },
    resultats: function () {
      return (
        !this.$store.state.calculs.dirty && this.$store.state.calculs.resultats
      )
    },
    hasWarning: function () {
      return this.accessStatus.forbidden
    },
    hasError: function () {
      return this.resultatStatus.error
    },
    hasErrorSave: function () {
      return this.$store.state.saveSituationError
    },
    shouldDisplayResults: function () {
      return (
        !(this.resultatStatus.updating || this.hasWarning || this.hasError) &&
        this.droits
      )
    },
  },
  methods: {
    restoreLatest: function () {
      const lastestSimulation = Simulation.getLatest()
      if (!lastestSimulation) {
        this.$matomo?.trackEvent("General", "redirection", this.$route.path)
        return this.$store.dispatch("redirection", (route) =>
          this.$router.push(route)
        )
      }

      this.$matomo?.trackEvent("General", "compute", this.$route.path)
      this.$store
        .dispatch("fetch", lastestSimulation)
        .then(() => this.$store.dispatch("compute"))

      return lastestSimulation
    },
    mock: function (detail) {
      if (this.$route.query.debug !== undefined) {
        this.$store.dispatch("mockResults", detail || this.$route.query.debug)
      }
      return this.$route.query.debug !== undefined
    },
  },
}
