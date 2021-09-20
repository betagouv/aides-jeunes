const cloneDeep = require("lodash/cloneDeep")

export const createContributionMixin = () => {
  return {
    methods: {
      initContribution(entityName) {
        if (!this.isRelevantQuestionForContribution()) return

        const contribution = cloneDeep(this.$store.state.contribution)
        if (!contribution[entityName]) contribution[entityName] = {}
        return contribution
      },
      isRelevantQuestionForContribution() {
        return this.$store.getters.isContributionMode
      },
      needCheckContrib(entityName, fieldName) {
        return (
          !this.$store.getters.isContributionMode ||
          (this.isRelevantQuestionForContribution() &&
            this.contribution[entityName][fieldName])
        )
      },
      saveContribution(entityName, fieldName, openfiscaVariable) {
        if (!this.isRelevantQuestionForContribution()) return

        if (this.contribution[entityName][fieldName]) {
          this.contribution[entityName] = {
            ...(this.contribution[entityName] || {}),
            [fieldName]: {
              openfiscaVariable: openfiscaVariable || fieldName,
              path: this.$route.path,
            },
          }
        } else {
          delete this.contribution[entityName][fieldName]
        }
        this.$store.dispatch("saveContribution", this.contribution)
      },
    },
  }
}
