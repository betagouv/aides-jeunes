import { EnumProperty, MultipleProperty } from "../property.js"
import { EnumItemProperty } from "../../types/property.js"
import Individu from "../../individu.js"
import { ressourceTypes } from "../../resources.js"
import { STATUT_OCCUPATION_LABEL } from "../../logement.js"

export default {
  default: [],
  ressources: new MultipleProperty({
    items: ressourceTypes.map((resource: any) => {
      return { label: resource.label, value: resource.id }
    }),
    question: ({ individu }) => {
      return `Quel type de revenu ${Individu.label(individu, "percevoir")} ?`
    },
  }),
  statut_occupation_logement: new EnumProperty({
    items: Object.keys(STATUT_OCCUPATION_LABEL).map((key) => {
      return <EnumItemProperty>{
        label: STATUT_OCCUPATION_LABEL[key],
        value: key,
      }
    }),
    question: "Quel est le code postal de la commune de vos parents ?",
  }),
}
