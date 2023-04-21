import { ref, computed } from "vue"
import Etablissement from "@/../lib/types/etablissement.d.js"
import {
  getBenefitEtablissements,
  getEtablissements,
} from "@lib/benefits/etablissements"
import { useStore } from "@/stores/index.js"
import { useRoute } from "vue-router"

export function useEtablissements() {
  const store = useStore()
  const $route = useRoute()

  const etablissements = ref<Etablissement[]>([])
  const currentEtablissement = computed(() => {
    return etablissements.value.find(
      (etablissement: Etablissement) =>
        etablissement.id === $route.params.etablissement_id
    )
  })
  const updating = ref(true)

  const city = store.situation.menage.depcom
  const benefits =
    !store.calculs.dirty && store.calculs.resultats.droitsEligibles
  const benefit: any = benefits
    ? benefits?.find((benefit: any) => benefit.id === $route.params.benefit_id)
    : null
  const types = getBenefitEtablissements(benefit)

  getEtablissements(city, types)
    .then((apiEtablissement) => {
      etablissements.value = apiEtablissement
    })
    .finally(() => {
      updating.value = false
    })

  return {
    etablissements,
    currentEtablissement,
    updating,
    benefit,
  }
}
