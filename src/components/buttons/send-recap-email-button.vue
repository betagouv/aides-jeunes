<template>
  <button
    class="fr-btn fr-btn--icon-center fr-icon-mail-line fr-px-3v"
    data-fr-opened="false"
    aria-controls="fr-modal-email"
    @click="openEmailAndSmsModal"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
import { useStore } from "@/stores/index.js"

export default {
  name: "SendRecapEmailButton",
  props: {
    text: {
      type: String,
      default: "Recevoir par email",
    },
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  methods: {
    openEmailAndSmsModal() {
      this.store.setModalState("show")
    },
  },
}
</script>
