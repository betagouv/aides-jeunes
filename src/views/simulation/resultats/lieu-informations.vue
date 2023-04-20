<script setup lang="ts">
import { ref, computed } from "vue"
import {
  getBenefitEtablissements,
  getEtablissements,
} from "@lib/benefits/etablissements"
import { useStore } from "@/stores/index.js"
import { useRoute, useRouter } from "vue-router"
import EtablissementInformations from "@/components/etablissement-informations.vue"
import BackButton from "@/components/buttons/back-button.vue"

const store = useStore()
const $route = useRoute()
const $router = useRouter()

const etablissements: any = ref([])
const currentEtablissement: any = computed(() => {
  return etablissements.value.find(
    (etablissement: any) => etablissement.id === $route.params.etablissement_id
  )
})
const updating = ref(true)

const city = store.situation.menage.depcom
const benefits = !store.calculs.dirty && store.calculs.resultats.droitsEligibles
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

const goBack = () => {
  if (benefit?.id) {
    const path = `/simulation/resultats/${benefit.id}/lieux`
    $router.push(path)
  } else {
    window?.history.back()
  }
}
</script>

<template>
  <div>
    <BackButton class="fr-mb-2w" size="small" @click="goBack"
      >Retour au lieux à proximité
    </BackButton>
    <h5 class="fr-h5 fr-mt-2w fr-mb-4w">
      {{ currentEtablissement?.nom }}
    </h5>
    <etablissement-informations
      v-if="currentEtablissement"
      :key="currentEtablissement.id"
      :etablissement="currentEtablissement"
    />
  </div>
</template>
