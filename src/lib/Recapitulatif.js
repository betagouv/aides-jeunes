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
  depcom() {
    const answer = this.$store.getters.getAnswer(
      "menage",
      "depcom",
      undefined,
      true
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
    const answer = this.$store.getters.getAnswer(
      "menage",
      "statut_occupation_logement",
      undefined,
      true
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
      return (
        this.$store.state.answers.enfants &&
        step.key.match(/\/simulation\/enfants$/)
      )
    },
    fn() {
      const enfants = this.$store.state.answers.enfants
      return [
        {
          label: "Mes enfants à charge",
          value:
            enfants && enfants.length
              ? `${enfants.length} enfant(s)`
              : `Aucun enfant`,
        },
      ]
    },
  },

  loyer: {
    matcher(step) {
      return step.key.match(/\/loyer$/)
    },
    fn() {
      const loyerData = Logement.getLoyerData(this.$store.getters.getAnswer)
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
        this.$store.getters.situation
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
