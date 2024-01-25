import { defineStore } from "pinia"
import { useStore } from "@/stores/index.js"
import {
  StandardBenefit,
  StandardBenefitGroup,
  BafaBenefit,
} from "@data/types/benefits"
import { hasBafaInterestFlag } from "@/lib/benefits.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

export const useResultsStore = defineStore("results", {
  getters: {
    benefits(): StandardBenefit[] {
      return this.resultats?.droitsEligibles || []
    },
    bafaBenefits(): BafaBenefit[] {
      return this.benefits.filter((benefit) => hasBafaInterestFlag(benefit))
    },
    benefitsWithoutBafa(): StandardBenefit[] {
      return this.benefits.filter((benefit) => !hasBafaInterestFlag(benefit))
    },
    benefitsGroups(): StandardBenefitGroup[] {
      return this.bafaBenefits.length > 0 ? [this.bafaBenefitsGroup] : []
    },
    filteredBenefits(): StandardBenefit[] {
      return this.benefitsWithoutBafa || []
    },
    filteredBenefitsAndBenefitsGroups(): (
      | StandardBenefitGroup
      | StandardBenefit
    )[] {
      if (ABTestingService.getValues().aides_bafa === "aides_bafa_fusionnees") {
        return [...this.filteredBenefits, ...this.benefitsGroups]
      } else {
        return this.benefits
      }
    },
    bafaBenefitsGroup(): StandardBenefitGroup {
      return {
        benefits: this.bafaBenefits,
        label: "Aides BAFA et BAFD",
        logoPath: "/img/benefits/logo-bafa-bafd.png",
        description:
          "Différents organismes peuvent vous aider à financer votre formation BAFA ou BAFD.",
        redirectionPage: "bafa-bafd",
      }
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
