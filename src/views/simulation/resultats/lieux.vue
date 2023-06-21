<script setup lang="ts">
import Lieu from "@/components/lieu.vue"
import BackButton from "@/components/buttons/back-button.vue"
import { useLieux } from "@/composables/use-lieux.js"
import { useRouter } from "vue-router"

const $router = useRouter()
const { lieux, updating, benefit } = useLieux()
const goBackToBenefitDetails = () => {
  if (benefit?.id) {
    const path = `/simulation/resultats/${benefit.id}`
    $router.push(path)
  } else {
    window?.history.back()
  }
}
</script>
<template>
  <div data-testid="lieux">
    <BackButton
      class="fr-mb-2w"
      size="small"
      data-testid="back-button"
      @click="goBackToBenefitDetails()"
      >Retour à l'aide
    </BackButton>
    <p class="fr-text--lg">
      Vous pouvez y être accompagné ou accompagnée pour faire votre demande et
      poser toutes vos questions.
    </p>
    <p v-show="updating">
      <span
        class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
        aria-hidden="true"
      ></span
      ><span class="fr-ml-2w">Récupération en cours…</span>
    </p>
    <div v-if="lieux?.length">
      <div v-for="(lieu, index) in lieux" :key="index">
        <Lieu :lieu="lieu" />
      </div>
    </div>
    <div v-else>
      <router-link to="/simulation/resultats">
        <BackButton class="fr-mb-4w" size="small"
          >Revenir aux résultats
        </BackButton>
      </router-link>
    </div>
  </div>
</template>
