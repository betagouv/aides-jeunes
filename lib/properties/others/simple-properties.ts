import { MultipleProperty } from "../property.js"
import Individu from "../../individu.js"
import { ressourceTypes } from "../../resources.js"
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
}
