import Individu from "@/lib/Individu"

export const createIndividuMixin = (props) => {
  const { fieldName = props, optional = false } = props

  return {
    data: function () {
      const params = this.$route.params
      const id = params.id
      const role = id.split("_")[0]
      const { individu } = Individu.get(
        this.$store.getters.peopleParentsFirst,
        role,
        params.id,
        this.$store.state.dates
      )
      const value = individu[fieldName]
      let contribution
      if (typeof this.initContribution === "function")
        contribution = this.initContribution(id)
      return {
        error: false,
        fieldName,
        individu,
        id,
        value,
        role,
        optional,
        contribution,
      }
    },
    methods: {
      getLabel: function (type) {
        return Individu.label(this.individu, type)
      },
      requiredValueMissing: function () {
        const hasError = !this.optional && this.value === undefined
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
        this.individu[fieldName] = this.value
        this.$store.dispatch("updateIndividu", this.individu)
        this.$push()
      },
    },
  }
}
