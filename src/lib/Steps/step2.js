import EnumQuestion from "@/components/Questions/Type/EnumQuestion"

export default {
  questions: [
    {
      type: EnumQuestion,
      label: "Quelle est la situation de vos parents ?",
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
    {
      type: EnumQuestion,
      label: "Quelle est la situation de vos parents 2 ?",
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
