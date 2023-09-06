<script setup lang="ts">
import { useStore } from "@/stores/index.js"
import { computed, defineProps } from "vue"

const props = defineProps({
  text: {
    type: String,
    default: "Recevoir par email",
  },
})

const store = useStore()
const openEmailAndSmsModal = () => store.setModalState("show")
const isDisabled = computed(() => {
  return (
    store.recapEmailState === "waiting" || store.recapPhoneState === "waiting"
  )
})
</script>

<template>
  <button
    class="fr-btn fr-btn--icon-center fr-icon-mail-line fr-px-3v"
    data-fr-opened="false"
    aria-controls="fr-modal-email"
    :disabled="isDisabled"
    @click="openEmailAndSmsModal"
  >
    {{ props.text }}
  </button>
</template>
