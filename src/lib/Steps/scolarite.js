import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import Individu from "@/lib/Individu"
import EnumQuestion from "@/components/Questions/Type/EnumQuestion"

const fieldName = "scolarite"

export default {
  questions: [
    {
      type: () => {
        const component = _.cloneDeep(EnumQuestion)

        component.mixins = [
          ...(EnumQuestion.mixins || []),
          createIndividuMixin(fieldName),
        ]
        return component
      },
      label: (component) => {
        return component.role == "demandeur"
          ? "Où êtes-vous scolarisé·e"
          : `Où sera scolarisé·e ${component.individu._firstName} à la rentrée prochaine`
      },
      fieldName: fieldName,
      items: Individu.scolariteOptions,
    },
  ],
}
