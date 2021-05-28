import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import EnumQuestion from "@/components/Questions/Type/EnumQuestion"

const fieldName = "statuts_etablissement_scolaire"

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
      label: "Dans quel type d'établissement étudiez-vous actuellement ?",
      fieldName: fieldName,
      items: [
        {
          value: "public",
          label: "Établissement public",
        },
        {
          value: "prive_sous_contrat",
          label: "Établissement privé sous contrat",
        },
        {
          value: "prive_hors_contrat",
          label: "Établissement privé hors contrat",
        },
        {
          value: "inconnu",
          label: "Autre",
        },
      ],
    },
  ],
}
