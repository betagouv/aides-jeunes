import { defineStore } from "pinia"
import { getEtablissements } from "@lib/benefits/etablissements.js"
import { HelpingInstitution } from "@lib/types/helping-institution.d.js"

export const useHelpingInstitutionStore = defineStore("helping-institution", {
  state: () => ({
    list: <HelpingInstitution[]>[],
    error: <string | null>null,
    updating: <boolean>false,
  }),
  actions: {
    setEtablissements(etablissements: HelpingInstitution[]) {
      this.list = etablissements
    },
    setError(error: string | null) {
      this.error = error
    },
    setUpdating(updating: boolean) {
      this.updating = updating
    },
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
  },
})
