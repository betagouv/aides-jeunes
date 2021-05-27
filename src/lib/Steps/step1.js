import YesNoQuestion from "@/components/Questions/Type/YesNoQuestion"
import EnumQuestion from "@/components/Questions/Type/EnumQuestion"

export default {
  questions: [
    {
      type: YesNoQuestion,
      label: "Quelle est la situation de vos parents ?",
      fieldName: "question1",
      enSavoirPlus: function (store) {
        store
        return "info lol"
      },
    },
    {
      type: EnumQuestion,
      label: "Quelle est la situation de vos parents ? lol",
      fieldName: "question1",
      items: [
        {
          label: "En couple",
          value: "en_couple",
        },
        {
          label: "Séparés",
          value: "separes",
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
      ],
    },
  ],
}
