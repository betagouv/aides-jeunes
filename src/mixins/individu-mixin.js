import Individu from "@lib/individu.js"
import { getAnswer } from "@lib/answers.js"

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
        value,
        role,
        optional,
      }
    },
    methods: {
      getLabel(type) {
        return Individu.label(this.individu, type)
      },
      canSubmit(submit) {
        const hasError =
          !this.optional && (this.value === undefined || this.value === "")
        if (submit) {
          this.store.updateError(hasError && "Ce champ est obligatoire.")
        }
        return !hasError
      },
      onSubmit() {
        if (this.canSubmit(true)) {
          this.store.answer({
            id: this.$route.params.id,
            entityName: "individu",
            fieldName: this.fieldName,
            path: this.$route.path,
            value: this.value,
          })
          this.$push()
        }
      },
    },
  }
}
