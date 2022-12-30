<script setup>
import { defineProps } from "vue"
import { useStore } from "@/stores"

defineProps({
  text: {
    type: String,
    default: "Recevoir par email",
  },
})

const store = useStore()

const showModal = () => {
  store.setRecapEmailState("show")
}
</script>

<template>
  <button
    class="fr-btn fr-btn--icon-center fr-icon-mail-line fr-px-3v"
    data-fr-opened="false"
    aria-controls="fr-modal-email"
    @click="showModal"
  >
    {{ text }}
  </button>
</template>
