import ABTestingService from "@/plugins/ABTestingService"
import { isRelevant } from "@/lib/Utils"

const STEPS = {
  _situation: {
    question: "Quelle est la situation de vos parents ?",
    questionType: "enum",
    items: (component) => {
      let items = [
        {
          label: "En couple",
          value: "en_couple",
        },
        {
          label: "Séparés",
          value: "separes",
        },
        {
          label: "Célibataire",
          value: "celibataire",
          isRelevant: () => {
            const abTesting = ABTestingService.getEnvironment()
            return (
              !abTesting.parentCelibataire ||
              (abTesting.parentCelibataire && abTesting.parentCelibataire.value)
            )
          },
        },
        {
          label: "Veuf ou veuve",
          value: "veuve",
        },
        {
          label: "Décédés",
          value: "decedes",
        },
        {
          label: "Sans autorité parentale",
          value: "sans_autorite",
        },
      ]
      return isRelevant(items, component)
    },
  },
  _en_france: {
    question: "Vos parents habitent-ils en France ?",
  },
  nbptr: {
    question:
      "Quel est le nombre de parts sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    optional: true,
  },
  rfr: {
    question:
      "Quel est le revenu fiscal de référence (RFR) sur le plus récent avis d'imposition de vos parents ?",
    questionType: "number",
    wrapperClassName: "aj-input-currency-wrapper",
  },
}

export default {
  STEPS,
}
