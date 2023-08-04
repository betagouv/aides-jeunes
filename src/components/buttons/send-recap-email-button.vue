<template>
  <button
    v-if="experimentNewRecapEmail"
    class="fr-btn fr-btn--icon-center fr-icon-mail-line fr-px-3v"
    @click="goToEmailFormPage"
  >
    {{ text }}
  </button>
  <button
    v-else
    class="fr-btn fr-btn--icon-center fr-icon-mail-line fr-px-3v"
    data-fr-opened="false"
    aria-controls="fr-modal-email"
    @click="goToEmailFormModal"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
import { useStore } from "@/stores/index.js"
import ABTestingService from "@/plugins/ab-testing-service.js"
import { EventCategories } from "@lib/enums/event-categories.js"
import StatisticsMixin from "@/mixins/statistics.js"

export default {
  name: "SendRecapEmailButton",
  mixins: [StatisticsMixin],
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
        EventCategories.FOLLOWUP,
        "Affiche le formulaire",
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
