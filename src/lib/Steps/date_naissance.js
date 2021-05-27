import DateQuestion from "@/components/Questions/Type/DateQuestion"
import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"

const fieldName = "date_naissance"

const component = _.cloneDeep(DateQuestion)

component.mixins = [
  ...(DateQuestion.mixins || []),
  createIndividuMixin(fieldName),
]

export default {
  questions: [
    {
      type: component,
      label: (component) => {
        return component.role === "demandeur"
          ? `Quelle est votre date de naissance ?`
          : `Quelle est la date de naissance ${component.getLabel(
              "préposition"
            )}${component.getLabel("nom")} ?`
      },
      fieldName: fieldName,
    },
  ],
}
