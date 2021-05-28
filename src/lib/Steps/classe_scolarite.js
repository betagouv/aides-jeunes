import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import EnumQuestion from "@/components/Questions/Type/EnumQuestion"

const fieldName = "classe_scolarite"

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
      items: (component) => {
        return [
          {
            value: "terminale",
            label: "Terminale",
            only: "lycee",
          },
          {
            label: "Licence - 3ème année",
            value: "licence_3",
            only: "enseignement_superieur",
          },
          {
            label: "Master - 1ère année",
            value: "master_1",
            only: "enseignement_superieur",
          },
          {
            label: "Autre",
            value: "autre",
          },
        ].filter(
          (item) => !item.only || item.only == component.individu.scolarite
        )
      },
    },
  ],
}
