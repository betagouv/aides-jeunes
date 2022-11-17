import { EnumProperty, MultipleProperty } from "../property"
import { EnumItemProperty } from "../../types/property"
import Individu from "../../individu"
import { ressourceTypes } from "../../resources"
import { STATUT_OCCUPATION_LABEL } from "../../logement"
import { capitalize } from "vue"

export default {
  ressources: new MultipleProperty({
    question: ({ individu }) => {
      return `Quel type de revenu ${Individu.label(individu, "percevoir")} ?`
    },
    items: ressourceTypes.map((resource: any) => {
      return { value: resource.id, label: resource.label }
    }),
    recapHeader: ({ individu }) => {
      return {
        rowClass: "row-space",
        label: capitalize(Individu.label(individu, "nom")),
        labelClass: "individu-title",
        hideEdit: true,
      }
    },
  }),
  default: [],
}
