export const createQuestionErrorMixin = () => {
  return {
    computed: {
      hasQuestionError: function () {
        return this.questionError !== undefined
      },
    },
    data: function () {
      return {
        questionError: undefined,
      }
    },
  }
}
