import { defineStore } from "pinia"
import storageService from "@/lib/storage-service.js"

export const useIframeStore = defineStore("iframe", {
  state: () => {
    const { inIframe, iframeHeaderCollapse } =
      storageService.session.getItem("iframe") || {}
    return {
      inIframe,
      iframeHeaderCollapse,
    }
  },
  actions: {
    save() {
      storageService.session.setItem("iframe", {
        inIframe: this.inIframe,
        iframeHeaderCollapse: this.iframeHeaderCollapse,
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
