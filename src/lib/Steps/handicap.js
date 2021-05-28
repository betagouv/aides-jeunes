import { createIndividuMixin } from "@/mixins/Steps/IndividuMixin"
import _ from "lodash"
import YesNoQuestion from "@/components/Questions/Type/YesNoQuestion"
import { capitalize } from "@/lib/Utils"

const fieldName = "handicap"

export default {
  questions: [
    {
      type: () => {
        const component = _.cloneDeep(YesNoQuestion)

        component.mixins = [
          ...(YesNoQuestion.mixins || []),
          createIndividuMixin(fieldName),
        ]
        return component
      },
      label: (component) => {
        return `${capitalize(
          component.getLabel("être")
        )} en situation de handicap ?`
      },
      fieldName: fieldName,
      enSavoirPlus: (component) => {
        const variation = component.$route.path
        if (variation && variation.includes("enfant")) {
          return `Votre enfant est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
        } else if (variation && variation.includes("conjoint")) {
          return `Votre conjoint est « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci l'a reconnu comme tel·le et qu'elle lui a également attribué un « taux d'incapacité » lié à son handicap.`
        } else {
          return `Vous êtes « en situation de handicap » lorsque vous avez déposé un dossier à la MDPH (Maison Départementale des personnes handicapées)\
          et que celle-ci vous a reconnu comme tel·le et qu'elle vous a également attribué un « taux d'incapacité » lié à votre handicap.`
        }
      },
    },
  ],
}
