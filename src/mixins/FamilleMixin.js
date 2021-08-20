export const createFamilleMixin = (props) => {
  const { fieldName = props, optional = false } = props

  return {
    data: function () {
      const famille = { ...this.$store.state.situation.famille }
      const value = famille[fieldName]

      let contribution
      if (typeof this.initContribution === "function")
        contribution = this.initContribution("famille", fieldName)
      return {
        famille,
        value,
        contribution,
      }
    },
    methods: {
      onSubmit: function () {
        if (!optional && this.value === undefined) {
          this.$store.dispatch("updateError", "Ce champ est obligatoire.")
          return
        }
        this.famille[fieldName] = this.value
        this.$store.dispatch("updateFamille", this.famille)
        this.$push()
      },
    },
  }
}
