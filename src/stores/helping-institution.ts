import { defineStore } from "pinia"
import { getEtablissements } from "../../lib/benefits/etablissements"
import { HelpingInstitution } from "../../lib/types/helping-institution"

export const useHelpingInstitutionStore = defineStore("helping-institution", {
  actions: {
    get(payload: { city: string; types: string[] }) {
      this.setError(null)
      this.setUpdating(true)
      return getEtablissements(payload.city, payload.types)
        .then((etablissements: HelpingInstitution[]) => {
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
        .catch(() => this.setError("Aucun résultat"))
    },
    setError(error: string | null) {
      this.error = error
    },
    setEtablissements(etablissements: HelpingInstitution[]) {
      this.list = etablissements
    },
    setUpdating(updating: boolean) {
      this.updating = updating
    },
  },
  state: () => ({
    error: <string | null>null,
    list: <HelpingInstitution[]>[],
    updating: <boolean>false,
  }),
})
