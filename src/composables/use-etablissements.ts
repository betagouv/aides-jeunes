import { ref, computed } from "vue"
import {
  getBenefitEtablissements,
  getEtablissements,
} from "@lib/benefits/etablissements"
import { useStore } from "@/stores/index.js"
import { useRoute } from "vue-router"
import Individu from "@lib/individu.js"
import { ActiviteType } from "@lib/enums/activite.js"
import { HelpingInstitution } from "@lib/types/helping-institution.d.js"
import * as Sentry from "@sentry/vue"

export function useEtablissements() {
  const store = useStore()
  const $route = useRoute()

  const etablissements = ref<HelpingInstitution[]>([])
  const benefit = ref<any>(null)
  const updating = ref<boolean>(true)

  const city = store.situation.menage.depcom

  const currentEtablissement = computed(() => {
    return etablissements.value.find(
      (etablissement: HelpingInstitution) =>
        etablissement.id === $route.params.etablissement_id
    )
  })

  interface EtablissementTypeCriteria {
    isRelevant?: (demandeur: any, situation: any) => boolean
    types: string[]
  }

  const etablissementsList: EtablissementTypeCriteria[] = [
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

  const getSituationEtablissements = () => {
    const relevantTypes: string[] = []
    for (const etablissement of etablissementsList) {
      const isRelevant = etablissement.isRelevant
        ? etablissement.isRelevant(store.situation.demandeur, store.situation)
        : true
      if (isRelevant) {
        relevantTypes.push(...etablissement.types)
      }
    }
    return relevantTypes
  }

  const loadEtablissements = async () => {
    if (!city) {
      Sentry.captureMessage(`Depcom required to loadEtablissement()`)
      updating.value = false
      return
    }
    let etablissementTypes: any = null
    const benefitId = $route.params.benefit_id || $route.params.droitId // Problème historique => Todo : uniformiser les paramètres des routes avec benefit_id
    if (benefitId) {
      const benefits =
        !store.calculs.dirty && store.calculs.resultats.droitsEligibles
      benefit.value = benefits
        ? benefits.find((b: any) => b.id === benefitId)
        : null
      etablissementTypes = getBenefitEtablissements(benefit.value)
    } else {
      etablissementTypes = getSituationEtablissements()
    }
    if (etablissementTypes.length > 0) {
      const apiEtablissements = await getEtablissements(
        city,
        etablissementTypes
      )
      etablissements.value = apiEtablissements.sort((a, b) => {
        return (
          etablissementTypes.indexOf(a.pivotLocal) -
          etablissementTypes.indexOf(b.pivotLocal)
        )
      })
    }
    updating.value = false
  }

  loadEtablissements()

  return {
    etablissements,
    currentEtablissement,
    updating,
    benefit,
  }
}
