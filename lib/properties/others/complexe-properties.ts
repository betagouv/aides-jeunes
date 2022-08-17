import { PropertyData } from "../../types/property.js"
import { capitalize } from "vue"
import Individu from "../../individu.js"
import { getLoyerData } from "../../logement.js"
import { getAnswer } from "../../answers.js"
import { ressourceTypes, ressourceCategories } from "../../resources.js"

export default {
  _hasRessources: {
    getFormat: (step: any, propertyData: PropertyData, individus: []) => {
      return propertyData.simulation.enfants.map((enfantNumber: number) => {
        const enfant = Individu.getById(individus, `enfant_${enfantNumber}`)
        return {
          answerFormat: {
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
            type: "boolean",
          },
          text: `${capitalize(
            enfant._firstName
          )} a-t-il/elle perçu des ressources <strong>depuis ${
            propertyData.periods.twelveMonthsAgo.label
          }</strong> ?`,
        }
      })
    },
    matcher: (step: any) => step.variable === "_hasRessources",
  },
  loyer: {
    getFormat: (step: any, propertyData: PropertyData) => {
      const loyerData = getLoyerData(propertyData.simulation.answers.all)
      return [loyerData.loyerQuestion, loyerData.chargesQuestion]
        .filter((question) => question)
        .map((question) => {
          return {
            answersFormat: {
              type: "number",
            },
            hint: question.hint,
            text: question.label,
          }
        })
    },
    matcher: (step: any) => step.variable === "loyer",
  },
  "ressources/montants": {
    getFormat(step: any, propertyData: PropertyData) {
      const answerFormat = this.getResourcesTypesByCategoryId(
        step,
        propertyData.simulation.answers.all
      ).map((resource: any) => {
        const period = resource.isMontantAnnuel ? "YYYY" : "YYYY-MM"
        return {
          amounts: {
            [period]: "number",
          },
          id: resource.id,
        }
      })

      const category = ressourceCategories.find(
        (category: any) => category.id === step.variable
      )

      return {
        answerFormat,
        text: category.label,
      }
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

    matcher(step: any) {
      return ressourceCategories.some(
        (category: any) => category.id === step.variable
      )
    },
  },
}
