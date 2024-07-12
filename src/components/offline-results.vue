<script setup lang="ts">
import { ref, watch, toRefs } from "vue"
import RecapEmailAndSmsModal from "@/components/modals/recap-email-and-sms-modal.vue"
import SendRecapButton from "@/components/buttons/send-recap-button.vue"
import { useStore } from "@/stores/index.js"

const store = useStore()
const { modalState } = toRefs(store)
const show = ref(modalState.value !== undefined)

declare global {
  interface Window {
    dsfr: (element: HTMLElement) => {
      modal: { conceal: () => void; disclose: () => void }
    }
  }
}

watch(modalState, (newValue) => {
  show.value = newValue !== undefined
  if (!show.value) {
    const modal = document.getElementById("fr-modal-email")
    if (modal) {
      window.dsfr(modal).modal.conceal()
    }
  }
})
</script>

<template>
  <div v-if="show">
    <h2 class="fr-text--lead">Je garde ces informations&nbsp;!</h2>
    <p>
      Vous pouvez enregistrer les résultats de votre simulation pour les
      consulter plus tard.
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-xs">
      <li>
        <SendRecapButton></SendRecapButton>
      </li>
    </ul>
  </div>
  <RecapEmailAndSmsModal></RecapEmailAndSmsModal>
</template>
