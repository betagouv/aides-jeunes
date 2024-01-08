import { defineStore } from "pinia"
import { useStore } from "@/stores/index.js"
import { StandardBenefit } from "@data/types/benefits"
import { hasBafaInterestFlag } from "@/lib/benefits.js"

export const useResultsStore = defineStore("results", {
  getters: {
    benefits(): StandardBenefit[] {
      return this.resultats?.droitsEligibles
    },
    bafaBenefits(): StandardBenefit[] {
      return this.benefits?.filter((benefit) => hasBafaInterestFlag(benefit))
    },
    benefitsWithoutBafa(): StandardBenefit[] {
      return this.benefits?.filter((benefit) => !hasBafaInterestFlag(benefit))
    },
    hasBenefits(): boolean {
      return this.benefits?.length > 0
    },
    hasBafaBenefits(): boolean {
      return this.bafaBenefits?.length > 0
    },
    fetching() {
      return useStore().access.fetching
    },
    resultats() {
      return !useStore().calculs.dirty && useStore().calculs.resultats
    },
    updating() {
      return useStore().calculs.updating
    },
    hasWarning() {
      return useStore().access.forbidden
    },
    error() {
      return useStore().calculs.error
    },
    exception() {
      return useStore().calculs.exception
    },
    hasErrorSave() {
      return useStore().saveSituationError
    },
    shouldDisplayResults() {
      return !(this.updating || this.hasWarning || this.error) && this.benefits
    },
    simulationAnonymized() {
      return useStore().simulationAnonymized
    },
    isSimulationUnavailable() {
      return this.simulationAnonymized && !useStore().followup
    },
  },
})
