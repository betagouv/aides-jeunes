export const createFamilleMixin = (props) => {
  const { fieldName = props, optional = false } = props

  return {
    data: function () {
      const value = this.$store.getters.getAnswer(
        "individu",
        "conjoint",
        fieldName
      )
      return {
        id: "individu",
        value,
      }
    },
    methods: {
      onSubmit: function () {
        if (!optional && this.value === undefined) {
          this.$store.dispatch("updateError", "Ce champ est obligatoire.")
          return
        }
        this.$store.dispatch("answer", {
          id: "conjoint",
          entityName: "individu",
          fieldName,
          value: this.value,
        })
        this.$push()
      },
    },
  }
}
