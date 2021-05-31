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
        payload.type

      return axios
        .get(API_URL)
        .then((response) => {
          if (!response.data.features) return []
          let listEtablissements = response.data.features
            .map(EtablissementLib.normalize)
            .sort((a, b) => {
              return (
                payload.type.indexOf(a.pivotLocal) -
                payload.type.indexOf(b.pivotLocal)
              )
            })
          state.commit("setEtablissements", listEtablissements)
          state.commit("setUpdating", false)
        })
        .catch(state.commit("setError", "Aucun résultat"))
    },
  },
  getters: {
    get(state) {
      return state.search
    },
  },
}

export default EtablissementModule
