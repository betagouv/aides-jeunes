import { defineStore } from "pinia"
import { useStore } from "@/stores/index.js"
import { Benefit } from "@data/types/benefits"

const store = useStore()

export const useResultsStore = defineStore("resultsStore", {
  getters: {
    benefits(): Benefit[] {
      return this.resultats?.droitsEligibles
    },
    hasBenefits() {
      return this.benefits.length > 0
    },
    resultatsId() {
      return this.resultats?._id || "???"
    },
    accessStatus() {
      return store.access
    },
    resultatStatus() {
      return store.calculs
    },
    resultats() {
      return !store.calculs.dirty && store.calculs.resultats
    },
    hasWarning() {
      return this.accessStatus.forbidden
    },
    hasError() {
      return this.resultatStatus.error
    },
    hasErrorSave() {
      return store.saveSituationError
    },
    shouldDisplayResults() {
      return (
        !(this.resultatStatus.updating || this.hasWarning || this.hasError) &&
        this.benefits
      )
    },
    ressourcesYearMinusTwoCaptured() {
      return store.ressourcesYearMinusTwoCaptured
    },
    simulationAnonymized() {
      return store.simulationAnonymized
    },
    eligibleBenefits() {
      return !store.calculs.dirty && store.calculs.resultats.droitsEligibles
    },
  },
})
