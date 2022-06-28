import { PropertyData } from "../../types/property"
const { getLoyerData } = require("../../logement")
const { getAnswer } = require("../../answers")
const { ressourceTypes, ressourceCategories } = require("../../resources")

export default {
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

      return [
        {
          text: category.label(),
          answerFormat,
        },
      ]
    },
  },
}
