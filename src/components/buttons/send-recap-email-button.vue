<template>
  <button
    v-if="experimentNewRecapEmail"
    class="fr-btn fr-icon-mail-line fr-px-3v"
    @click="goToEmailFormPage"
  >
    {{ text }}
  </button>
  <button
    v-else
    class="fr-btn fr-icon-mail-line fr-px-3v"
    data-fr-opened="false"
    aria-controls="fr-modal-email"
    @click="goToEmailFormModal"
  >
    {{ text }}
  </button>
</template>

<script>
import { useStore } from "@/stores/index.ts"
import ABTestingService from "@/plugins/ab-testing-service.ts"
import { EventCategories } from "@lib/enums/event-categories.ts"

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
    sendEvent() {
      this.sendEventToMatomo(
        EventCategories.GENERAL,
        "Recap",
        ABTestingService.getValues().recap_email_form
      )
    },
    goToEmailFormPage() {
      this.sendEvent()
      this.$router.push({ name: "resultatsRecapEmail" })
    },
    goToEmailFormModal() {
      this.sendEvent()
      this.store.setRecapEmailState("show")
    },
  },
}
</script>
