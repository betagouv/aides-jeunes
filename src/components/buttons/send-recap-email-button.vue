<template>
  <button
    v-if="show"
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
  computed: {
    show() {
      return (
        this.store.recapEmailState !== "ok" && this.$route.name === "resultats"
      )
    },
  },
  methods: {
    showModal() {
      this.store.setRecapEmailState("show")
    },
  },
}
</script>
