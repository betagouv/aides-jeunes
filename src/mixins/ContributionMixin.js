const cloneDeep = require("lodash/cloneDeep")

export const createContributionMixin = () => {
  return {
    methods: {
      initContribution(entityName, fieldName, openfiscaVariable) {
        if (
          !this.isRelevantQuestionForContribution(fieldName, openfiscaVariable)
        )
          return

        const contribution = cloneDeep(this.$store.state.contribution)
        if (!contribution[entityName]) contribution[entityName] = {}
        return contribution
      },
      isRelevantQuestionForContribution(fieldName, openfiscaVariable) {
        return Boolean(
          this.$store.getters.isContributionMode &&
            (!fieldName.startsWith("_") || openfiscaVariable)
        )
      },
      needCheckContrib(entityName, fieldName, openfiscaVariable) {
        return (
          !this.$store.getters.isContributionMode ||
          (this.isRelevantQuestionForContribution(
            fieldName,
            openfiscaVariable
          ) &&
            this.contribution[entityName][fieldName])
        )
      },
      saveContribution(entityName, fieldName, openfiscaVariable) {
        if (
          !this.isRelevantQuestionForContribution(fieldName, openfiscaVariable)
        )
          return

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
