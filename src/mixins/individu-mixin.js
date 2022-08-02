import Individu from "../../lib/individu"
import { getAnswer } from "../../lib/answers"

export const createIndividuMixin = (props) => {
  const { fieldName = props, optional = false } = props

  return {
    data: function () {
      const entityName = this.$route.path.split("/")[2]
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const value = getAnswer(
        this.$store.state.simulation.answers.all,
        entityName,
        fieldName,
        id
      )
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
      canSubmit: function (submit) {
        const hasError =
          !this.optional && (this.value === undefined || this.value === "")
        if (submit) {
          this.$store.dispatch(
            "updateError",
            hasError && "Ce champ est obligatoire."
          )
        }
        return !hasError
      },
      onSubmit: function () {
        if (this.canSubmit(true)) {
          this.$store.dispatch("answer", {
            id: this.$route.params.id,
            entityName: "individu",
            fieldName: this.fieldName,
            value: this.value,
          })
          this.$push()
        }
      },
    },
  }
}
