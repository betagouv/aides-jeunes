<script setup lang="ts">
import RecapEmailForm from "@/components/recap-email-form.vue"
import RecapSmsForm from "@/components/recap-sms-form.vue"
import { useRouter } from "vue-router"
import BackButton from "@/components/buttons/back-button.vue"
import { ref } from "vue"
import { useStore } from "@/stores/index.js"

const store = useStore()

const router = useRouter()
const showEmailForm = ref(true)

const goBack = () => {
  router.push({ path: "/simulation/resultats" })
}

const navSelection = (value: boolean) => {
  showEmailForm.value = value
}

const currentNavItem = (item: string) => {
  return (item === "email" && showEmailForm.value) ||
    (item === "sms" && !showEmailForm.value)
    ? true
    : undefined
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
      v-if="store.DEV_SHOW_SMS_TAB"
      id="header-navigation"
      class="fr-nav fr-mb-2w fr-ml-2w"
      role="navigation"
      aria-label="Menu principal"
    >
      <ul class="fr-nav__list">
        <li class="fr-nav__item">
          <a
            class="fr-nav__link fr-text--bold"
            href="#"
            target="_self"
            :aria-current="currentNavItem('email')"
            @click.prevent="navSelection(true)"
            >Par email
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            class="fr-nav__link fr-text--bold"
            href="#"
            target="_self"
            :aria-current="currentNavItem('sms')"
            @click.prevent="navSelection(false)"
            >Par SMS
          </a>
        </li>
      </ul>
    </nav>
    <p>
      Si vous le souhaitez nous pouvons vous recontacter à deux reprises pour
      faire le point sur les démarches que vous avez faites et les blocages que
      vous avez rencontrés.
    </p>
    <template v-if="showEmailForm">
      <RecapEmailForm></RecapEmailForm>
    </template>
    <template v-else>
      <RecapSmsForm></RecapSmsForm>
    </template>
  </div>
</template>
