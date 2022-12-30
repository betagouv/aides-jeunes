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

<script>
import { useStore } from "@/stores"
import { mapStores } from "pinia"

export default {
  name: "SendRecapEmailButton",
  props: {
    text: {
      type: String,
      default: "Recevoir par email",
    },
  },
  computed: {
    ...mapStores(useStore),
  },
  methods: {
    showModal() {
      this.storeStore.setRecapEmailState("show")
    },
  },
}
</script>
