import { MultipleProperty } from "../property.js"
import IndividuMethods from "../../individu.js"
import { ressourceTypes } from "../../resources.js"
import { capitalize } from "../../../lib/utils.js"

function perceivedLabel(individu) {
  const label = IndividuMethods.label(individu, "percevoir")
  return individu.id.startsWith("enfant") ? capitalize(label) : label
}

export default {
  ressources: new MultipleProperty({
    question: ({ individu }) =>
      `Quel type de revenu ${perceivedLabel(individu)} ?`,
    items: ressourceTypes.map((resource: any) => {
      return { value: resource.id, label: resource.label }
    }),
    recapHeader: ({ individu }) => {
      return {
        rowClass: "row-space",
        label: capitalize(IndividuMethods.label(individu, "nom")),
        labelClass: "individu-title",
        hideEdit: true,
      }
    },
  }),
}
