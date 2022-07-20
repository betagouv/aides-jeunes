import { defineStore } from "pinia"
import { getEtablissements } from "../../lib/benefits/etablissements"

export const useInstitutionStore = defineStore("institution", {
  // convert to a function
  state: () => ({
    list: [],
    error: null,
    updating: false,
  }),
  actions: {
    setEtablissements(etablissements) {
      this.list = etablissements
    },
    setError(error) {
      this.error = error
    },
    setUpdating(payload) {
      this.updating = payload
    },
    get(payload) {
      this.setError(null)
      this.setUpdating(true)
      return getEtablissements(payload.city, payload.types)
        .then((etablissements) => {
          return etablissements.sort((a, b) => {
            return (
              payload.types.indexOf(a.pivotLocal) -
              payload.types.indexOf(b.pivotLocal)
            )
          })
        })
        .then((etablissements) => {
          this.setEtablissements(etablissements)
          this.setUpdating(false)
        })
        .catch(this.setError("Aucun résultat"))
    },
  },
})
