export const createBasicQuestionSubmitMixin = () => {
  return {
    methods: {
      onSubmit: function () {
        if ("onSubmit" in this.question) this.question.onSubmit(this)
        return this.value
      },
    },
  }
}
