<script setup lang="ts">
import { ref, watch, toRefs } from "vue"
import RecapEmailAndSmsModal from "@/components/modals/recap-email-and-sms-modal.vue"
import SendRecapButton from "@/components/buttons/send-recap-button.vue"
import { useStore } from "@/stores/index.js"

const store = useStore()
const { modalState } = toRefs(store)
const show = ref(modalState.value !== undefined)

watch(modalState, (newValue) => {
  show.value = newValue !== undefined
})
</script>

<template>
  <div v-if="show">
    <h2 class="fr-text--lead"> Je garde ces informations&nbsp;! </h2>
    <p>
      Vous pouvez enregistrer les résultats de votre simulation pour les
      consulter plus tard.
    </p>
    <ul class="fr-btns-group fr-btns-group--inline-xs">
      <li>
        <SendRecapButton></SendRecapButton>
      </li>
    </ul>
    <RecapEmailAndSmsModal></RecapEmailAndSmsModal>
  </div>
</template>
