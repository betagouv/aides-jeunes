import { getEtablissements } from "@lib/benefits/etablissements"

const EtablissementModule = {
  actions: {
    get(state, payload) {
      state.commit("setError", null)
      state.commit("setUpdating", true)
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
          state.commit("setEtablissements", etablissements)
          state.commit("setUpdating", false)
        })
        .catch(state.commit("setError", "Aucun résultat"))
    },
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    setEtablissements(state, etablissements) {
      state.list = etablissements
    },
    setUpdating(state, payload) {
      state.updating = payload
    },
  },
  namespaced: true,
  state() {
    return {
      error: null,
      list: [],
      updating: false,
    }
  },
}

export default EtablissementModule
