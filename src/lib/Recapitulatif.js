import Individu from "@/lib/Individu"
import {
  capitalize,
  displayCurrencyValue,
  displayDepcomValue,
} from "@/lib/Utils"
import Ressource from "../../lib/ressource"
import {
  ressourceCategories,
  ressourceTypes,
} from "../../lib/constants/resources"
import Logement from "@/lib/Logement"
import { getAnswer, getStepAnswer } from "../../lib/answers"

export const getIndividuByStep = (step, component) => {
  const role = step.id.split("_")[0]
  return Individu.get(
    component.$store.getters.peopleParentsFirst,
    role,
    step.id,
    component.$store.state.dates
  ).individu
}

export const SIMPLE_STEPS = {
  ressources(step) {
    const answer = getStepAnswer(this.$store.state.answers.current, step)
    return [
      {
        label: "Vos types de revenus ?",
        value:
          answer && answer.length > 0
            ? answer
                .map(
                  (ressourceId) =>
                    ressourceTypes.find(
                      (ressource) => ressource.id === ressourceId
                    ).label
                )
                .join(", ")
            : "Aucuns",
      },
    ]
  },
  depcom() {
    const answer = getStepAnswer(
      this.$store.state.answers.current,
      "menage",
      "depcom",
      undefined
    )

    return [
      {
        label: "Quel est votre code postal ?",
        value: answer
          ? displayDepcomValue(answer._codePostal, answer._nomCommune)
          : undefined,
      },
    ]
  },

  _bourseCriteresSociauxCommuneDomicileFamilial(step) {
    const individu = getIndividuByStep(step, this)
    return [
      {
        label: "Quel est le code postal de la commune de vos parents ?",
        value: displayDepcomValue(
          individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal,
          individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune
        ),
      },
    ]
  },

  statut_occupation_logement() {
    const answer = getStepAnswer(
      this.$store.state.answers.current,
      "menage",
      "statut_occupation_logement",
      undefined
    )

    return [
      {
        label: "Êtes-vous ?",
        value: Logement.getStatutOccupationLabel(answer),
      },
    ]
  },
}

export const COMPLEX_STEPS = {
  enfants: {
    matcher(step) {
      if (step.key.match(/\/simulation\/enfants$/)) {
        return getAnswer(this.$store.state.answers.all, "enfants") !== undefined
      }
      return false
    },
    fn() {
      const answer = getAnswer(this.$store.state.answers.all, "enfants")
      return [
        {
          label: "Mes enfants à charge",
          value: answer ? `${answer} enfant(s)` : `Aucun enfant`,
        },
      ]
    },
  },

  loyer: {
    matcher(step) {
      return step.key.match(/\/loyer$/)
    },
    fn() {
      const loyerData = Logement.getLoyerData(this.$store.state.answers.all)
      return [
        {
          label: loyerData.loyerQuestion.label,
          value: loyerData.loyerQuestion.selectedValue
            ? displayCurrencyValue(loyerData.loyerQuestion.selectedValue)
            : undefined,
        },
        loyerData.chargesQuestion && {
          label: loyerData.chargesQuestion.label,
          value: loyerData.chargesQuestion.selectedValue
            ? displayCurrencyValue(loyerData.chargesQuestion.selectedValue)
            : undefined,
        },
      ].filter((item) => item)
    },
  },

  "ressources/montants": {
    matcher(step) {
      return step.key.match(/ressources\/montants\/(\w)*/)
    },
    fn(step) {
      const key_split = step.key.split("/")
      const id = key_split[1]
      const individu = getIndividuByStep({ id, role: id.split("_")[0] }, this)

      const categoryId = key_split[key_split.length - 1]
      const ressources = Ressource.getIndividuRessourceTypes(
        individu,
        this.$store.state.answers
      )
      const category = ressourceCategories.find(
        (category) => category.id === categoryId
      )
      const result = [
        {
          isChapterSubtitle: true,
          label: category && capitalize(category.label(individu)),
          value: "",
        },
        ...ressourceTypes
          .filter((type) => type.category === categoryId && ressources[type.id])
          .map((type) => {
            return {
              label: capitalize(type.label),
              value: Object.entries(individu[type.id]).reduce(
                (accum, [key, value]) => {
                  accum[key] = displayCurrencyValue(value)
                  return accum
                },
                {}
              ),
            }
          }),
      ]
      return result
    },
  },
}
