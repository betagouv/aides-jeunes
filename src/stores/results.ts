import { defineStore } from "pinia"
import { useStore } from "@/stores/index.js"
import { StandardBenefit, BenefitGroup } from "@data/types/benefits"
import { hasBafaInterestFlag, hasVeloInterestFlag } from "@/lib/benefits.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

export const useResultsStore = defineStore("results", {
  getters: {
    benefits(): StandardBenefit[] {
      return this.resultats?.droitsEligibles || []
    },
    benefitTreeGroupExperiment(): (StandardBenefit | BenefitGroup)[] {
      const bafaGroup: BenefitGroup = {
        benefits: [],
        id: "bafa-bafd-group",
        label: "Aides BAFA et BAFD",
        logoPath: "/img/benefits/logo-bafa-bafd.png",
        description:
          "Différents organismes peuvent vous aider à financer votre formation BAFA ou BAFD.",
        redirectionPage: "bafa-bafd",
      }

      const veloGroup: BenefitGroup = {
        benefits: [],
        id: "velo-group",
        label: "Aides pour acheter un vélo",
        logoPath: "/img/institutions/logo_etat_francais.png",
        description:
          "Différents organismes peuvent vous aider à financer votre vélo.",
        redirectionPage: "velo",
      }

      const results = this.benefits.reduce((results, benefit) => {
        if (hasBafaInterestFlag(benefit)) {
          if (bafaGroup.benefits.length === 0) {
            results.push(bafaGroup)
          }
          bafaGroup.benefits.push(benefit)
          benefit.groupLabel = bafaGroup.label
        } else if (hasVeloInterestFlag(benefit)) {
          if (veloGroup.benefits.length === 0) {
            results.push(veloGroup)
          }
          veloGroup.benefits.push(benefit)
          benefit.groupLabel = veloGroup.label
        } else {
          results.push(benefit)
        }
        return results
      }, [])

      if (bafaGroup.benefits.length < 2) {
        return this.benefits
      } else {
        return results
      }
    },
    benefitTree(): (StandardBenefit | BenefitGroup)[] {
      if (
        ABTestingService.getValues().aides_bafa ===
        "aides_bafa_fusionnees_conserve_position"
      ) {
        return this.benefitTreeGroupExperiment
      } else {
        return this.benefits
      }
    },
    hasBenefitsGroup(): boolean {
      return this.benefitTreeGroupExperiment.some(
        (benefitOrBenefitsGroup) => benefitOrBenefitsGroup.benefits?.length > 0
      )
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
      return (
        !(this.updating || this.hasWarning || this.error) &&
        this.resultats?.droitsEligibles
      )
    },
    simulationAnonymized() {
      return useStore().simulationAnonymized
    },
    isSimulationUnavailable() {
      return this.simulationAnonymized && !useStore().followup
    },
  },
})
