import { EnumProperty, MultipleProperty, Property } from "../property"
import { EnumItemProperty, PropertyData } from "../../types/property"
const Individu = require("../../individu")
const { ressourceTypes } = require("../../resources")
const { STATUT_OCCUPATION_LABEL } = require("../../logement")

export default {
  _bourseCriteresSociauxCommuneDomicileFamilial: new Property({
    question: "Quel est le code postal de la commune de vos parents ?",
    questionType: "depcom",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAnswerFormat(propertyData: PropertyData): any {
      return {
        type: {
          _bourseCriteresSociauxCommuneDomicileFamilial: "string",
          _bourseCriteresSociauxCommuneDomicileFamilialCodePostal: "string",
          _bourseCriteresSociauxCommuneDomicileFamilialNomCommune: "string",
          _bourseCriteresSociauxCommuneDomicileFamilialDepartement: "string",
          _bourseCriteresSociauxCommuneDomicileFamilialRegion: "string",
          _bourseCriteresSociauxCommuneDomicileFamilialEpci: "string",
          _bourseCriteresSociauxCommuneDomicileFamilialEpciType: "string",
        },
      }
    },
  }),
  depcom: new Property({
    question: "Quel est votre code postal ?",
    questionType: "depcom",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAnswerFormat(propertyData: PropertyData): any {
      return {
        type: {
          depcom: "string",
          _codePostal: "string",
          _nomCommune: "string",
          _departement: "string",
          _region: "string",
          _epci: "string",
          _epciType: "string",
        },
      }
    },
  }),
  _firstName: new Property({
    question:
      "Quel est le prénom de votre enfant ? Il servira uniquement à vous faciliter la saisie par la suite.",
    questionType: "text",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAnswerFormat(propertyData: PropertyData): any {
      return {
        type: "string",
      }
    },
  }),
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
}
