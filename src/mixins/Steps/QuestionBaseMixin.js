import { executeFunctionOrReturnValue } from "@/lib/Utils"

export const createQuestionBaseMixin = () => {
  return {
    computed: {
      questionLabel: function () {
        return executeFunctionOrReturnValue(this.question, "label", this)
      },
      enSavoirPlus: function () {
        return executeFunctionOrReturnValue(this.question, "enSavoirPlus", this)
      },
    },
    data: function () {
      return {
        value: undefined,
      }
    },
  }
}
