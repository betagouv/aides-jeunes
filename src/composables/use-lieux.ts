import { ref, computed } from "vue"
import { getBenefitLieuxTypes, fetchLieux } from "@lib/benefits/lieux"
import { useStore } from "@/stores/index.js"
import { useRoute } from "vue-router"
import Individu from "@lib/individu.js"
import { ActiviteType } from "@lib/enums/activite.js"
import { lieuLayout } from "@lib/types/lieu.d.js"
import * as Sentry from "@sentry/vue"
import { benefitLayout } from "@data/types/benefits"
import Simulation from "@/lib/simulation.js"

export function useLieux() {
  const store = useStore()
  const $route = useRoute()

  const lieux = ref<lieuLayout[]>([])
  const benefit = ref<benefitLayout | null>(null)
  const updating = ref<boolean>(true)

  const currentLieu = computed(() => {
    return lieux.value.find(
      (lieu: lieuLayout) => lieu.id === $route.params.lieu_id
    )
  })

  interface LieuTypeCriteria {
    isRelevant?: (demandeur: any, situation: any) => boolean
    types: string[]
  }

  const lieuTypeCriterias: LieuTypeCriteria[] = [
    {
      isRelevant: (demandeur: any, situation: any) => {
        const demandeurAge = Individu.age(demandeur, situation.dateDeValeur)
        return demandeurAge <= 25 && demandeurAge >= 16
      },
      types: ["mission_locale", "cij"],
    },
    {
      isRelevant: (demandeur: any) => {
        return demandeur.activite === ActiviteType.chomeur
      },
      types: ["pole_emploi"],
    },
    {
      isRelevant: (demandeur: any) => {
        return demandeur.handicap
      },
      types: ["maison_handicapees"],
    },
    {
      // Les centres départements d'action sociale ont des noms différents en fonction des territoires
      types: ["cdas", "centre_social", "edas", "mds", "sdsei"],
    },
    {
      types: ["ccas", "mairie", "mairie_com", "msap"],
    },
  ]

  const getRelevantLieuxTypesBySituation = (): string[] => {
    const relevantTypes: string[] = []

    for (const lieuTypeCriteria of lieuTypeCriterias) {
      const isRelevant = lieuTypeCriteria.isRelevant
        ? lieuTypeCriteria.isRelevant(
            store.situation.demandeur,
            store.situation
          )
        : true

      if (isRelevant) {
        relevantTypes.push(...lieuTypeCriteria.types)
      }
    }

    return relevantTypes
  }

  const loadLieux = async () => {
    let city = store.situation.menage.depcom
    const simulationId = Simulation.getLatestId()
    if (!store.hasResults && !city && simulationId) {
      await store.fetch(simulationId)
      city = store.situation.menage.depcom
    }

    if (!city) {
      Sentry.captureMessage(`Depcom required to loadLieux()`)
      updating.value = false
      return
    }

    const benefitId = $route.params.benefitId
    const storeBenefits =
      !store.calculs.dirty && store.calculs.resultats.droitsEligibles
    benefit.value =
      (storeBenefits &&
        storeBenefits?.find(
          (storeBenefit: any) => storeBenefit.id === benefitId
        )) ||
      null

    const lieuTypes = benefit.value
      ? getBenefitLieuxTypes(benefit.value)
      : getRelevantLieuxTypesBySituation()

    if (lieuTypes.length > 0) {
      try {
        const apiLieux = await fetchLieux(city, lieuTypes)
        lieux.value = apiLieux.sort((a, b) => {
          return (
            lieuTypes.indexOf(a.pivotLocal) - lieuTypes.indexOf(b.pivotLocal)
          )
        })
      } catch (error) {
        Sentry.captureMessage(`Error loadLieux() : ${error}`)
      }
    }

    updating.value = false
  }

  loadLieux()

  return {
    lieux,
    currentLieu,
    updating,
    benefit,
    loadLieux,
  }
}
