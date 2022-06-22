import { EnumProperty, MultipleProperty, Property } from "../property"
import { EnumItemProperty, PropertyData } from "../../types/property"
const Individu = require("../../individu")
const { ressourceCategories } = require("../../resources")
const { STATUT_OCCUPATION_LABEL } = require("../../logement")

export default {
  _bourseCriteresSociauxCommuneDomicileFamilial: new Property({
    question: "Quel est le code postal de la commune de vos parents ?",
    questionType: "depcom",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAnswerFormat(propertyData: PropertyData): any {
      return {
        type: `{
        _bourseCriteresSociauxCommuneDomicileFamilial: string,
        _bourseCriteresSociauxCommuneDomicileFamilialCodePostal: string,
        _bourseCriteresSociauxCommuneDomicileFamilialNomCommune: string,
        _bourseCriteresSociauxCommuneDomicileFamilialDepartement: string,
        _bourseCriteresSociauxCommuneDomicileFamilialRegion: string,
        _bourseCriteresSociauxCommuneDomicileFamilialEpci: string,
        _bourseCriteresSociauxCommuneDomicileFamilialEpciType: string,
      }`,
      }
    },
  }),
  depcom: new Property({
    question: "Quel est votre code postal ?",
    questionType: "depcom",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAnswerFormat(propertyData: PropertyData): any {
      return {
        type: `{
        depcom: string,
        _codePostal: string,
        _nomCommune: string,
        _departement: string,
        _region: string,
        _epci: string,
        _epciType: string,
      }`,
      }
    },
  }),
  ressources: new MultipleProperty({
    question: ({ individu }) => {
      return `Quel type de revenu ${Individu.label(individu, "percevoir")} ?`
    },
    items: ressourceCategories.map(
      (category: { id: string; label: () => {} }) => {
        return <EnumItemProperty>{
          value: category.id,
          label: category.label(),
        }
      }
    ),
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
}
