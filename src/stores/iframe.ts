import { defineStore } from "pinia"
import storageService from "@/lib/storage-service.js"

function getMode() {
  return window.parent !== window ? "basic" : "integrated"
}

export const useIframeStore = defineStore("iframe", {
  state: () => {
    const contexts = storageService.session.getItem("iframe") || {
      basic: {},
      integrated: {},
    }
    const mode = getMode()
    const { inIframe, iframeHeaderCollapse } = contexts[mode] || {}

    return {
      inIframe,
      iframeHeaderCollapse,
    }
  },
  actions: {
    save() {
      const iframeCurrentState = storageService.session.getItem("iframe")
      storageService.session.setItem("iframe", {
        ...iframeCurrentState,
        ...{
          [getMode()]: {
            inIframe: this.inIframe,
            iframeHeaderCollapse: this.iframeHeaderCollapse,
          },
        },
      })
    },
    setInIframe() {
      this.inIframe = true
      this.save()
    },
    setIframeHeaderCollapse(collapse = false) {
      this.iframeHeaderCollapse = collapse
      this.save()
    },
  },
})
