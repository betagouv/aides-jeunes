import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import Individu from "@/lib/Individu"
import EnumQuestion from "@/components/Questions/Type/EnumQuestion"
import { isRelevant } from "@/lib/Utils"

const fieldName = "activite"

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
        return `${component.getLabel("être")} ?`
      },
      fieldName: fieldName,
      items: (component) => {
        let items = [
          {
            value: "etudiant",
            label: "Étudiant·e en formation ou alternance",
          },
          {
            value: "actif",
            label: "En activité salariée ou indépendante",
          },
          {
            value: "chomeur",
            label: "Inscrit·e comme demandeur d’emploi",
          },
          {
            value: "retraite",
            label: "Retraité·e",
            isRelevant: (component) =>
              Individu.age(
                component.individu,
                component.$store.state.dates.today.value
              ) > 30,
          },
          {
            value: "inactif",
            label: "Autre",
          },
        ]
        return isRelevant(items, component)
      },
    },
  ],
}
