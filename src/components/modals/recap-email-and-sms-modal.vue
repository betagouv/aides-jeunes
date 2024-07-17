<script setup lang="ts">
import RecapEmailAndSmsForm from "@/components/recap-email-and-sms-form.vue"
import { computed } from "vue"
import ABTestingService from "@/plugins/ab-testing-service.js"

const headerTitle = computed(() => {
  return process.env.VITE_SHOW_SMS_TAB &&
    ABTestingService.getValues().Followup_SMS === "show"
    ? "Recevoir les résultats par email/SMS"
    : "Recevoir les résultats par email"
})
</script>

<template>
  <dialog
    id="fr-modal-email"
    aria-labelledby="fr-modal-email-title"
    role="dialog"
    class="fr-modal"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-8 fr-col-lg-7">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <h1 id="fr-modal-email-title" class="fr-modal__title fr-pt-2w">{{
                headerTitle
              }}</h1>
              <button
                v-analytics="{ action: 'Fermé bouton', category: 'Email' }"
                class="fr-btn--close fr-btn"
                title="Fermer la fenêtre modale"
                aria-controls="fr-modal-email"
                >Fermer</button
              >
            </div>
            <RecapEmailAndSmsForm></RecapEmailAndSmsForm>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
