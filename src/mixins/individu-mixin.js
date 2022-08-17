import Individu from "@lib/individu"
import { getAnswer } from "@lib/answers"

export const createIndividuMixin = (props) => {
  const { fieldName = props, optional = false } = props

  return {
    data() {
      const entityName = this.$route.path.split("/")[2]
      const id = this.$route.params.id
      const role = id.split("_")[0]
      const value = getAnswer(
        this.store.simulation.answers.all,
        entityName,
        fieldName,
        id
      )
      return {
        error: false,
        fieldName,
        id,
        optional,
        role,
        value,
      }
    },
    methods: {
      canSubmit(submit) {
        const hasError =
          !this.optional && (this.value === undefined || this.value === "")
        if (submit) {
          this.store.updateError(hasError && "Ce champ est obligatoire.")
        }
        return !hasError
      },
      getLabel(type) {
        return Individu.label(this.individu, type)
      },
      onSubmit() {
        if (this.canSubmit(true)) {
          this.store.answer({
            entityName: "individu",
            fieldName: this.fieldName,
            id: this.$route.params.id,
            value: this.value,
          })
          this.$push()
        }
      },
    },
  }
}
