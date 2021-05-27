import DateQuestion from "@/components/Questions/Type/DateQuestion"
import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import Individu from "@/lib/Individu"

const fieldName = "activite"

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
        return `${component.getLabel("être")} ?`
      },
      fieldName: fieldName,
      items: [
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
      ],
    },
  ],
}
