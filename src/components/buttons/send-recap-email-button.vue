<template>
  <button
    class="fr-btn fr-icon-mail-line fr-px-3v"
    data-fr-opened="false"
    aria-controls="fr-modal-email"
    @click="goToEmailForm"
  >
    {{ text }}
  </button>
</template>

<script>
import { useStore } from "@/stores/index.ts"
import ABTestingService from "@/plugins/ab-testing-service.js"

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
      experimentNewRecapEmail:
        ABTestingService.getValues().recap_email_form === "Page",
    }
  },
  methods: {
    goToEmailForm() {
      if (this.experimentNewRecapEmail) {
        this.$router.push({ name: "resultatsRecapEmail" })
      } else {
        this.store.setRecapEmailState("show")
      }
    },
  },
}
</script>
