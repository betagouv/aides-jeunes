import Warning from "../lib/warnings"

export const createDepcomMixin = () => {
  return {
    computed: {
      warningMessage() {
        return Warning.get("aj_not_reliable", this.codePostal)
      },
    },
    methods: {
      canSubmit(submit) {
        if (!this.nomCommune || !this.codePostal) {
          submit &&
            this.$store.dispatch("updateError", "Ce champ est obligatoire.")
          return false
        }
        return Boolean(this.matchingCommune)
      },
    },
  }
}
