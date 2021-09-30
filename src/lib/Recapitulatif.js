import Individu from "@/lib/Individu"
import {
  capitalize,
  displayCurrencyValue,
  displayDepcomValue,
  displayEnumValue,
  displayYesNoValue,
} from "@/lib/Utils"
import Ressource from "@/lib/Ressource"
import { ressourceCategories, ressourceTypes } from "@/constants/resources"
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
    const menage = this.$store.getters.getMenage
    return [
      {
        label: "Quel est votre code postal ?",
        value: displayDepcomValue(menage._codePostal, menage._nomCommune),
      },
    ]
  },

  enfant_a_charge(step) {
    const individu = getIndividuByStep(step, this)
    return [
      {
        label: capitalize(
          individu._role === "demandeur"
            ? `Figurez-vous sur la dernière déclaration d'impôts de vos parents ?`
            : `${Individu.label(
                individu,
                "nom"
              )} figure-t-il/elle sur votre dernière déclaration d'impôts sur le revenu ?`
        ),
        value: displayYesNoValue(
          individu["enfant_a_charge"][this.$store.state.dates.thisYear.id]
        ),
      },
    ]
  },

  statut_marital(step) {
    const individu = getIndividuByStep(step, this)
    return [
      {
        label: "Quelle est votre relation avec votre conjoint ?",
        value: displayEnumValue(
          individu[step.variable],
          Individu.situationsFamiliales
        ),
      },
    ]
  },

  _bourseCriteresSociauxCommuneDomicileFamilial() {
    return [
      {
        label: "Quel est le code postal de la commune de vos parents ?",
        value: displayDepcomValue(
          this.individu._bourseCriteresSociauxCommuneDomicileFamilialCodePostal,
          this.individu._bourseCriteresSociauxCommuneDomicileFamilialNomCommune
        ),
      },
    ]
  },
}

export const COMPLEX_STEPS = {
  enfants: {
    matcher(step) {
      return step.key.match(/\/simulation\/enfants$/)
    },
    fn() {
      const enfants = this.$store.state.situation.enfants
      return [
        {
          label: "Mes enfants à charge",
          value: enfants.length
            ? `${enfants.length} enfant(s)`
            : `Aucun enfant`,
        },
      ]
    },
  },

  logement: {
    matcher(step) {
      return step.key.match(/\/logement$/)
    },
    fn() {
      const menage = this.$store.state.situation.menage
      return [
        {
          label: "Êtes-vous ?",
          value: Logement.getStatutOccupationLabel(
            menage.statut_occupation_logement
          ),
        },
      ]
    },
  },

  loyer: {
    matcher(step) {
      return step.key.match(/\/loyer$/)
    },
    fn() {
      const loyerData = Logement.getLoyerData(
        this.$store.getters.getMenage,
        this.$store.getters.getLogementStatut || ""
      )
      return [
        {
          label: loyerData.loyerQuestion.label,
          value: displayCurrencyValue(loyerData.loyerQuestion.selectedValue),
        },
        loyerData.chargesQuestion && {
          label: loyerData.chargesQuestion.label,
          value: displayCurrencyValue(loyerData.chargesQuestion.selectedValue),
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
        this.$store.state.situation
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
