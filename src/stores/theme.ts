import { defineStore } from "pinia"
import storageService from "@/lib/storage-service.js"

export const useThemeStore = defineStore("theme", {
  state: () => {
    return {
      theme: storageService.session.getItem("theme"),
    }
  },
  actions: {
    set(theme) {
      if (theme) {
        storageService.session.setItem("theme", theme)
      }
      this.theme = storageService.session.getItem("theme")
    },
  },
})
