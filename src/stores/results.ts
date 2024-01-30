import { defineStore } from "pinia"
import { useStore } from "@/stores/index.js"
import { StandardBenefit, StandardBenefitGroup } from "@data/types/benefits"
import { hasBafaInterestFlag } from "@/lib/benefits.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

export const useResultsStore = defineStore("results", {
  getters: {
    benefits(): StandardBenefit[] {
      return this.resultats?.droitsEligibles || []
    },
    benefitTreeGroupExperiment(): (StandardBenefit | StandardBenefitGroup)[] {
      const groups = this.benefits.reduce(
        (groups, benefit) => {
          if (hasBafaInterestFlag(benefit)) {
            groups.bafa.push(benefit)
          } else {
            groups.other.push(benefit)
          }
          return groups
        },
        { bafa: [], other: [] }
      )
      if (groups.bafa.length) {
        const bafaGroup: StandardBenefitGroup = {
          benefits: groups.bafa,
          id: "bafa-bafd-group",
          label: "Aides BAFA et BAFD",
          logoPath: "/img/benefits/logo-bafa-bafd.png",
          description:
            "Différents organismes peuvent vous aider à financer votre formation BAFA ou BAFD.",
          redirectionPage: "bafa-bafd",
        }
        return [...groups.other, bafaGroup]
      } else {
        return groups.other
      }
    },
    benefitTree(): (StandardBenefit | StandardBenefitGroup)[] {
      if (ABTestingService.getValues().aides_bafa === "aides_bafa_fusionnees") {
        return this.benefitTreeGroupExperiment
      } else {
        return this.benefits
      }
    },
    hasBenefits(): boolean {
      return this.benefits?.length > 0
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
