import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import Individu from "@/lib/Individu"
import EnumQuestion from "@/components/Questions/Type/EnumQuestion"

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
            value: "inactif",
            label: "Autre",
          },
        ]

        if (
          Individu.age(
            component.individu,
            component.$store.state.dates.today.value
          ) > 30
        )
          items.push({
            value: "retraite",
            label: "Retraité·e",
          })

        return items
      },
    },
  ],
}
