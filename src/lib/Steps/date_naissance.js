import DateQuestion from "@/components/Questions/Type/DateQuestion"
import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"

const fieldName = "date_naissance"

DateQuestion.mixins = [
  ...(DateQuestion.mixins || []),
  createIndividuMixin(fieldName),
]

export default {
  questions: [
    {
      type: DateQuestion,
      label: "Quelle est votre date de naissance ?",
      fieldName: fieldName,
    },
  ],
}
