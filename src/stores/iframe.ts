import { defineStore } from "pinia"
import storageService from "@/lib/storage-service.js"

export const useIframeStore = defineStore("iframe", {
  state: () => {
    return {
      inIframe: false,
      iframeOrigin: null,
      iframeHeaderCollapse: false,
    }
  },
  actions: {
    setIframeOrigin(newOrigin: string) {
      this.inIframe = true
      this.iframeOrigin = newOrigin
    },
    setIframeHeaderCollapse(collapse = false) {
      this.iframeHeaderCollapse = collapse
    },
    set(theme) {
      if (theme) {
        storageService.session.setItem("theme", theme)
      }
      this.theme = storageService.session.getItem("theme")
    },
  },
})
