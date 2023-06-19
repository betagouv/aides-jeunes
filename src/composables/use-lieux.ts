import { ref, computed } from "vue"
import { getBenefitLieuxTypes, getLieux } from "@lib/benefits/lieux"
import { useStore } from "@/stores/index.js"
import { useRoute } from "vue-router"
import Individu from "@lib/individu.js"
import { ActiviteType } from "@lib/enums/activite.js"
import { LieuLayout } from "@lib/types/lieu.d.js"
import * as Sentry from "@sentry/vue"

export function useLieux() {
  const store = useStore()
  const $route = useRoute()

  const lieux = ref<LieuLayout[]>([])
  const benefit = ref<any>(null)
  const updating = ref<boolean>(true)

  const city = store.situation.menage.depcom

  const currentLieu = computed(() => {
    return lieux.value.find(
      (lieu: LieuLayout) => lieu.id === $route.params.lieu_id
    )
  })

  interface LieuTypeCriteria {
    isRelevant?: (demandeur: any, situation: any) => boolean
    types: string[]
  }

  const lieuxList: LieuTypeCriteria[] = [
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

  const getSituationLieux = () => {
    const relevantTypes: string[] = []
    for (const lieu of lieuxList) {
      const isRelevant = lieu.isRelevant
        ? lieu.isRelevant(store.situation.demandeur, store.situation)
        : true
      if (isRelevant) {
        relevantTypes.push(...lieu.types)
      }
    }
    return relevantTypes
  }

  const loadLieux = async () => {
    if (!city) {
      Sentry.captureMessage(`Depcom required to loadLieux()`)
      updating.value = false
      return
    }
    let lieuTypes: any = null
    const benefitId = $route.params.benefit_id || $route.params.droitId // Problème historique => Todo : uniformiser les paramètres des routes avec benefit_id
    if (benefitId) {
      const benefits =
        !store.calculs.dirty && store.calculs.resultats.droitsEligibles
      benefit.value = benefits
        ? benefits.find((b: any) => b.id === benefitId)
        : null
      lieuTypes = getBenefitLieuxTypes(benefit.value)
    } else {
      lieuTypes = getSituationLieux()
    }
    if (lieuTypes.length > 0) {
      const apiLieux = await getLieux(city, lieuTypes)
      lieux.value = apiLieux.sort((a, b) => {
        return lieuTypes.indexOf(a.pivotLocal) - lieuTypes.indexOf(b.pivotLocal)
      })
    }
    updating.value = false
  }

  loadLieux()

  return {
    lieux,
    currentLieu,
    updating,
    benefit,
  }
}
