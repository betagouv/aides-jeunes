import Individu from "@/../lib/Individu"

export const createIndividuMixin = (props) => {
  const { fieldName = props, optional = false } = props

  return {
    data: function () {
      const entityName = this.$route.path.split("/")[2]
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const value = this.$store.getters.getAnswer(id, entityName, fieldName)
      return {
        error: false,
        fieldName,
        id,
        value,
        role,
        optional,
      }
    },
    methods: {
      getLabel: function (type) {
        return Individu.label(this.individu, type)
      },
      requiredValueMissing: function () {
        const hasError =
          !this.optional && (this.value === undefined || this.value === "")
        this.$store.dispatch(
          "updateError",
          hasError && "Ce champ est obligatoire."
        )
        return hasError
      },
      onSubmit: function () {
        if (this.requiredValueMissing()) {
          return
        }
        this.$store.dispatch("answer", {
          id: this.$route.params.id,
          entityName: "individu",
          fieldName: this.fieldName,
          value: this.value,
        })
        this.$push()
      },
    },
  }
}
