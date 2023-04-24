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

  interface Etablissement {
    isRelevant?: (demandeur: any, situation: any) => boolean
    types: string[]
  }

  const etablissementsList: Etablissement[] = [
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
    let types: any = null

    if ($route.params.benefit_id) {
      const benefits =
        !store.calculs.dirty && store.calculs.resultats.droitsEligibles
      benefit.value = benefits
        ? benefits.find((b: any) => b.id === $route.params.benefit_id)
        : null
      types = getBenefitEtablissements(benefit.value)
    } else {
      types = getSituationEtablissements()
    }

    const apiEtablissements = await getEtablissements(city, types)
    etablissements.value = apiEtablissements.sort((a, b) => {
      return types.indexOf(a.pivotLocal) - types.indexOf(b.pivotLocal)
    })
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
