import { defineStore } from "pinia"
import storageService from "@/lib/storage-service.js"

export const useHistoryStore = defineStore("history", {
  state: () => {
    return {
      historyStateEnfants: storageService.session.getItem(
        "historyStateEnfants"
      ),
    }
  },
  actions: {
    setHistoryStateEnfants(historyStateEnfants) {
      if (historyStateEnfants) {
        storageService.session.setItem(
          "historyStateEnfants",
          historyStateEnfants
        )
      }
      this.historyStateEnfants = storageService.session.getItem(
        "historyStateEnfants"
      )
    },
  },
})
