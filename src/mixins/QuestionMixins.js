export const createQuestionMixin = () => {
  return {
    computed: {
      enSavoirPlus: function () {
        return this.question && this.question.enSavoirPlus
          ? this.question.enSavoirPlus(this.$store)
          : undefined
      },
      hasQuestionError: function () {
        return this.questionError !== undefined
      },
    },
    data: function () {
      return {
        value: undefined,
        questionError: undefined,
      }
    },
  }
}
