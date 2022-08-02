import { EnumProperty, MultipleProperty } from "../property.js"
import { EnumItemProperty } from "../../types/property.js"
import Individu from "../../individu.js"
import { ressourceTypes } from "../../resources.js"
import { STATUT_OCCUPATION_LABEL } from "../../logement.js"

export default {
  ressources: new MultipleProperty({
    question: ({ individu }) => {
      return `Quel type de revenu ${Individu.label(individu, "percevoir")} ?`
    },
    items: ressourceTypes.map((resource: any) => {
      return { value: resource.id, label: resource.label }
    }),
  }),
  statut_occupation_logement: new EnumProperty({
    question: "Quel est le code postal de la commune de vos parents ?",
    items: Object.keys(STATUT_OCCUPATION_LABEL).map((key) => {
      return <EnumItemProperty>{
        label: STATUT_OCCUPATION_LABEL[key],
        value: key,
      }
    }),
  }),
  default: [],
}
