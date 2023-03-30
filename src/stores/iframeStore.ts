import { defineStore } from "pinia"
export const useIframeStore = defineStore({
  id: "useIframeStore",
  state: () => ({
    selectedTheme: "default-dsfr",
  }),
  getters: {
    getSelectedTheme: (state) => state.selectedTheme,
  },
  actions: {
    setSelectedTheme(theme: string) {
      this.selectedTheme = theme
    },
  },
})
