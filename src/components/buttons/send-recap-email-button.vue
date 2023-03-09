<template>
  <button
    class="fr-btn fr-icon-mail-line fr-px-3v"
    data-fr-opened="false"
    aria-controls="fr-modal-email"
    @click="showModal"
  >
    {{ text }}
  </button>
</template>

<script>
import { useStore } from "@/stores/index.ts"

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
    showModal() {
      this.store.setRecapEmailState("show")
    },
  },
}
</script>
