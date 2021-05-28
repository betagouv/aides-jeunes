import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import YesNoQuestion from "@/components/Questions/Type/YesNoQuestion"
import { capitalize } from "@/lib/Utils"

const fieldName = "alternant"

export default {
  questions: [
    {
      type: () => {
        const component = _.cloneDeep(YesNoQuestion)

        component.mixins = [
          ...(YesNoQuestion.mixins || []),
          createIndividuMixin(fieldName),
        ]
        return component
      },
      label: (component) => {
        return `${capitalize(component.getLabel("être"))} en alternance ?`
      },
      fieldName: fieldName,
    },
  ],
}
