// import DateQuestion from "@/components/Questions/Type/DateQuestion"
import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"

const fieldName = "date_naissance"

export default {
  questions: [
    {
      type: () => {
        return import("@/components/Questions/Type/DateQuestion").then(
          (DateQuestion) => {
            const component = _.cloneDeep(DateQuestion.default)

            component.mixins = [
              ...(DateQuestion.default.mixins || []),
              createIndividuMixin(fieldName),
            ]
            return component
          }
        )
      },
      label: (component) => {
        return component.role === "demandeur"
          ? `Quelle est votre date de naissance ?`
          : `Quelle est la date de naissance ${component.getLabel(
              "préposition"
            )}${component.getLabel("nom")} ?`
      },
      fieldName: fieldName,
      errorMessage: "Veuillez renseigner une date de naissance valide.",
    },
  ],
}
