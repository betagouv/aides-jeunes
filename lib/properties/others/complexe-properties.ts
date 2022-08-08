import { PropertyData } from "../../types/property.js"
import { capitalize } from "vue"
import Individu from "../../individu.js"
import { getLoyerData } from "../../logement.js"
import { getAnswer } from "../../answers.js"
import { ressourceTypes, ressourceCategories } from "../../resources.js"

export default {
  _hasRessources: {
    matcher: (step: any) => step.variable === "_hasRessources",
    getFormat: (step: any, propertyData: PropertyData, individus: []) => {
      return propertyData.simulation.enfants.map((enfantNumber: number) => {
        const enfant = Individu.getById(individus, `enfant_${enfantNumber}`)
        return {
          text: `${capitalize(
            enfant._firstName
          )} a-t-il/elle perçu des ressources <strong>depuis ${
            propertyData.periods.twelveMonthsAgo.label
          }</strong> ?`,
          answerFormat: {
            type: "boolean",
            items: [
              {
                label: "Oui",
                value: true,
              },
              {
                label: "Non",
                value: false,
              },
            ],
          },
        }
      })
    },
  },
  loyer: {
    matcher: (step: any) => step.variable === "loyer",
    getFormat: (step: any, propertyData: PropertyData) => {
      const loyerData = getLoyerData(propertyData.simulation.answers.all)
      return [loyerData.loyerQuestion, loyerData.chargesQuestion]
        .filter((question) => question)
        .map((question) => {
          return {
            text: question.label,
            hint: question.hint,
            answersFormat: {
              type: "number",
            },
          }
        })
    },
  },
  "ressources/montants": {
    matcher(step: any) {
      return ressourceCategories.some(
        (category: any) => category.id === step.variable
      )
    },

    getResourcesTypesByCategoryId(
      { entity, id }: { entity: string; id: string },
      answers: []
    ) {
      return (getAnswer(answers, entity, "ressources", id) || []).map(
        (ressource: any) => {
          const ressourceType = ressourceTypes.find(
            (r: any) => r.id === ressource
          )
          return ressourceType
        }
      )
    },

    getFormat(step: any, propertyData: PropertyData) {
      const answerFormat = this.getResourcesTypesByCategoryId(
        step,
        propertyData.simulation.answers.all
      ).map((resource: any) => {
        const period = resource.isMontantAnnuel ? "YYYY" : "YYYY-MM"
        return {
          id: resource.id,
          amounts: {
            [period]: "number",
          },
        }
      })

      const category = ressourceCategories.find(
        (category: any) => category.id === step.variable
      )

      return {
        text: category.label,
        answerFormat,
      }
    },
  },
}
