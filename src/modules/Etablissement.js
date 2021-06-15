import axios from "axios"
import EtablissementLib from "../lib/Etablissement"
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
      const API_URL =
        "https://etablissements-publics.api.gouv.fr/v3/communes/" +
        payload.city +
        "/" +
        payload.types.join("+")

      return axios
        .get(API_URL)
        .then((response) => {
          if (!response.data.features) return []
          let listEtablissements = response.data.features
            .map(EtablissementLib.normalize)
            .sort((a, b) => {
              return (
                payload.types.indexOf(a.pivotLocal) -
                payload.types.indexOf(b.pivotLocal)
              )
            })
          state.commit("setEtablissements", listEtablissements)
          state.commit("setUpdating", false)
        })
        .catch(state.commit("setError", "Aucun résultat"))
    },
  },
}

export default EtablissementModule
