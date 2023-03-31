import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"

export const useIframeStore = defineStore({
  id: "useIframeStore",
  state: () => {
    return {
      theme: useLocalStorage("theme", "default-dsfr"),
    }
  },
  getters: {
    getTheme: (state) => state.theme,
  },
  actions: {
    setTheme(theme: string) {
      this.theme = theme
    },
  },
})
