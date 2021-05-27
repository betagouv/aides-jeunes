export const createBasicErrorMixin = () => {
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
    methods: {
      requiredValueMissing: function () {
        const hasError = this.value === undefined
        if (hasError) this.questionError = "Ce champ est obligatoire."
        return hasError
      },
    },
  }
}
