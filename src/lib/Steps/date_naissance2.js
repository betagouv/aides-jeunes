import DateQuestion from "@/components/Questions/Type/DateQuestion"
import { createBasicQuestionSubmitMixin } from "@/mixins/Steps/BasicQuestionSubmitMixin"
import _ from "lodash"

const fieldName = "date_naissance2"
const component = _.cloneDeep(DateQuestion)
component.mixins = [
  ...(DateQuestion.mixins || []),
  createBasicQuestionSubmitMixin(),
]

export default {
  questions: [
    {
      type: component,
      label: "Quelle est votre date de naissance 2 ?",
      fieldName: fieldName,
      onSubmit: (component) => {
        console.log(component)
        debugger // eslint-disable-line no-debugger
      },
    },
  ],
}
