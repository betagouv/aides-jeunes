import * as etablissements from "../../lib/benefits/etablissements"

const EtablissementModule = {
  namespaced: true,
  state() {
    return {
      list: [],
      error: null,
      updating: false,
    }
  },
  mutations: {
    setEtablissements(state, etablissements) {
      state.list = etablissements
    },
    setError(state, error) {
      state.error = error
    },
    setUpdating(state, payload) {
      state.updating = payload
    },
  },
  actions: {
    get(state, payload) {
      state.commit("setError", null)
      state.commit("setUpdating", true)
      return etablissements
        .getEtablissements(payload.city, payload.types)
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
}

export default EtablissementModule
