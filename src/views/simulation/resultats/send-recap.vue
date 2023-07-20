<script setup lang="ts">
import RecapEmailForm from "@/components/recap-email-form.vue"
import RecapEmailAndSmsForm from "@/components/recap-email-and-sms-form.vue"
import { useRouter } from "vue-router"
import BackButton from "@/components/buttons/back-button.vue"
import { computed } from "vue"

const router = useRouter()

const showSmsTab = computed(() => process.env.VITE_SHOW_SMS_TAB)

const goBack = () => {
  router.push({ path: "/simulation/resultats" })
}
</script>

<template>
  <div class="fr-grid-col">
    <BackButton
      class="fr-btn--secondary fr-btn--sm fr-mb-2w"
      data-testid="back-button"
      @click="goBack"
      >Retour aux résultats
    </BackButton>

    <nav
      v-if="showSmsTab"
      id="header-navigation"
      class="fr-nav fr-mb-2w fr-ml-2w"
      role="navigation"
      aria-label="Menu principal"
    >
    </nav>
    <p>
      Si vous le souhaitez nous pouvons vous recontacter à deux reprises pour
      faire le point sur les démarches que vous avez faites et les blocages que
      vous avez rencontrés.
    </p>
    <template v-if="showSmsTab">
      <RecapEmailAndSmsForm></RecapEmailAndSmsForm>
    </template>
    <template v-else>
      <RecapEmailForm></RecapEmailForm>
    </template>
  </div>
</template>
