export default {
  computed: {
    droits: function() {
      return this.resultats && this.resultats.droitsEligibles
    },
    droitsNonEligibles: function() {
      return (this.droitsNonEligiblesShow && this.resultats && this.resultats.droitsNonEligibles) || [] },
    droitsNonEligiblesShown: function() { return this.droitsNonEligibles.filter(i => i.id === "css_participation_forfaitaire") },
    droitsNonEligiblesShow: function() { return this.$store.state.ameliNoticationDone },
    resultatsId: function() { return this.resultats && this.resultats._id || '???' },
    accessStatus: function() { return this.$store.state.access },
    resultatStatus: function() { return this.$store.state.calculs },
    resultats: function() { return this.$store.state.calculs.resultats },
    hasWarning: function() {
      return this.accessStatus.forbidden
    },
    hasError: function() {
      return this.resultatStatus.error
    },
    shouldDisplayResults: function() {
      return !(this.resultatStatus.updating || this.hasWarning || this.hasError) && this.droits
    },
  },
  methods: {
    restoreLatest: function() {
        const lastestSituation = document.cookie.split('; ').reduce((accum, pair) => {
          const [key, value] = pair.split('=', 2)
          accum[key] = value
          return accum
        }, {}).lastestSituation
        if (!lastestSituation) {
          this.$matomo && this.$matomo.trackEvent('General', 'redirection', this.$route.path)
          return this.$store.dispatch('redirection', route => this.$router.push(route))
        }
        this.$store.dispatch('fetch', lastestSituation)
          .then(() => this.$store.dispatch('compute'))

        return lastestSituation
    },
    mock: function(detail) {
      if (this.$route.query.debug !== undefined) {
        this.$store.dispatch('mockResults', detail || this.$route.query.debug)
      }
      return this.$route.query.debug !== undefined
    }
  }
}
