import { returnStringOrExecuteFunction } from "@/lib/Utils"

export const createQuestionBaseMixin = () => {
  return {
    computed: {
      questionLabel: function () {
        return returnStringOrExecuteFunction(this.question, "label", this)
      },
      enSavoirPlus: function () {
        return returnStringOrExecuteFunction(
          this.question,
          "enSavoirPlus",
          this
        )
      },
    },
    data: function () {
      return {
        value: undefined,
      }
    },
  }
}
