import { EnumProperty, MultipleProperty } from "../property.js"
import { EnumItemProperty } from "../../types/property.js"
import Individu from "../../individu.js"
import { ressourceTypes } from "../../resources.js"
import { STATUT_OCCUPATION_LABEL } from "../../logement.js"
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
  statut_occupation_logement: new EnumProperty({
    question: "Quel votre statut d'occupation de logement ?",
    items: Object.keys(STATUT_OCCUPATION_LABEL).map((key) => {
      return <EnumItemProperty>{
        label: STATUT_OCCUPATION_LABEL[key],
        value: key,
      }
    }),
  }),
  default: [],
}
