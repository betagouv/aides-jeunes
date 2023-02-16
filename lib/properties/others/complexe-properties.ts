import { PropertyData, RecapPropertyLine, Step } from "../../types/property.js"
import { capitalize, displayCurrencyValue } from "../../utils.js"
import Individu from "../../individu.js"
import { getLoyerData } from "../../logement.js"
import { getAnswer } from "../../answers.js"
import { ressourceTypes, ressourceCategories } from "../../resources.js"
import { logementQuestionLayout } from "../../types/logement.d.js"
import { StepGeneratorLayout } from "../../types/steps.d.js"
import dayjs from "dayjs"

export default <{ [key: string]: any }>{
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
        .filter(
          (question): question is logementQuestionLayout =>
            typeof question !== "undefined"
        )
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getRecap(propertyData: PropertyData, step: Step): RecapPropertyLine[] {
      const loyerData = getLoyerData(propertyData.simulation.answers.all)
      const details = [
        {
          label: loyerData.loyerQuestion.label,
          value: displayCurrencyValue(loyerData.loyerQuestion.selectedValue),
        },
      ]
      if (loyerData.chargesQuestion) {
        details.push({
          label: loyerData.chargesQuestion.label,
          value: displayCurrencyValue(loyerData.chargesQuestion.selectedValue),
        })
      }
      return details
    },
  },
  "ressources/montants": {
    matcher(step: Step) {
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

    getFormat(step: StepGeneratorLayout, propertyData: PropertyData) {
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
        (category) => category.id === step.variable
      )

      return {
        text: category?.label,
        answerFormat,
      }
    },

    getRecap(propertyData: PropertyData, step: Step): RecapPropertyLine[] {
      const answer = (
        getAnswer(
          propertyData.simulation.answers.all,
          step.entity,
          step.variable,
          step.id
        ) || []
      ).map((ressource: any) => {
        const ressourceType = ressourceTypes.find(
          (ressourceType: any) => ressourceType.id === ressource.id
        )
        return {
          ...ressourceType,
          ...(ressource as any),
        }
      })

      let result: any = []
      if (answer.length) {
        const category = ressourceCategories.find(
          (category: any) => category.id === step.variable
        )
        result = [
          {
            labelClass: "subtitle",
            label: category && capitalize(category.label),
          },
          ...answer.map((ressource: any) => {
            return {
              label: capitalize(ressource.label),
              value: Object.entries(ressource.amounts).reduce(
                (accum: { [key: string]: string }, [key, value]) => {
                  const date = ressource.isMontantAnnuel
                    ? key
                    : capitalize(dayjs(key, "YYYY-MM").format("MMMM YYYY"))
                  accum[date] = displayCurrencyValue(value)
                  return accum
                },
                {}
              ),
            }
          }),
        ]
      }
      return result
    },
  },
  enfants: {
    matcher: (step: any) => step.entity === "enfants",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getRecap(propertyData: PropertyData, step: Step): RecapPropertyLine[] {
      const answer = getAnswer(propertyData.simulation.answers.all, "enfants")
      return [
        {
          label: "Mes enfants à charge",
          value: answer ? `${answer} enfant(s)` : `Aucun enfant`,
        },
      ]
    },
    getFormat() {
      return [
        {
          text: "Mes enfants à charge",
        },
      ]
    },
  },
}
