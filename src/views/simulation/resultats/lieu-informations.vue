<script setup lang="ts">
import EtablissementInformations from "@/components/etablissement-informations.vue"
import BackButton from "@/components/buttons/back-button.vue"
import { useEtablissements } from "@/composables/use-etablissements.js"
import { useRouter, useRoute } from "vue-router"
import { onMounted, computed } from "vue"

const $router = useRouter()
const $route = useRoute()
const { benefit, currentEtablissement, updating } = useEtablissements()
const goBackToNearbyPlaces = () => {
  if (benefit?.id) {
    const path = `/simulation/resultats/${benefit.id}/lieux`
    $router.push(path)
  } else {
    window?.history.back()
  }
}
onMounted(() => {
  updating.value = true
})

const backButtonLabel = computed(() =>
  $route.name === "helpBenefitEtablissementInformationsLight"
    ? "Retour au détail de l'aide"
    : "Retour aux lieux à proximité"
)
</script>

<template>
  <div class="fr-pt-2w">
    <BackButton class="fr-mb-2w" size="small" @click="goBackToNearbyPlaces">
      {{ backButtonLabel }}
    </BackButton>
    <h5 class="fr-h5 fr-mt-2w fr-mb-4w">
      {{ currentEtablissement?.nom }}
    </h5>
    <p v-show="updating">
      <span
        class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
        aria-hidden="true"
      ></span
      ><span class="fr-ml-2w">Récupération des informations en cours…</span>
    </p>
    <EtablissementInformations
      v-if="currentEtablissement && !updating"
      :key="currentEtablissement.id"
      :etablissement="currentEtablissement"
    />
  </div>
</template>
