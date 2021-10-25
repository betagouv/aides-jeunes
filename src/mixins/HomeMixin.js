export default {
  computed: {
    hasExistingSituation: function () {
      return this.$store.getters.passSanityCheck
    },
    ctaLabel: function () {
      return this.hasExistingSituation
        ? "Commencer une nouvelle simulation"
        : "Je commence"
    },
    ctaSize: function () {
      return this.hasExistingSituation ? "large" : "xlarge"
    },
  },
  methods: {
    newSituation: function () {
      this.$store.dispatch("clear", this.$route.query.external_id)
      this.next()
    },
    next: function () {
      this.$store.dispatch("openFiscaParameters")
      this.$store.dispatch("verifyBenefitVariables")
      this.$push()
    },
  },
}
