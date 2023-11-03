<script setup lang="ts">
import { computed } from "vue"
import { useStore } from "@/stores/index.js"

const store = useStore()

const recapPhoneState = computed(() => store.recapPhoneState)
const recapEmailState = computed(() => store.recapEmailState)
</script>
<template>
  <div class="fr-pb-3w">
    <div v-if="recapPhoneState != 'waiting' && recapEmailState != 'waiting'">
      <div
        v-if="recapPhoneState === 'error' || recapEmailState === 'error'"
        class="fr-alert fr-alert--error"
      >
        <p>
          Une erreur s'est produite dans l'envoi par
          {{
            recapPhoneState === "error" && recapEmailState === "error"
              ? "email et par SMS"
              : recapPhoneState === "error"
              ? "SMS. Service momentanément indisponible, veuillez réessayer plus tard. Vous pouvez également recevoir le récapitulatif par email."
              : "email. Service momentanément indisponible, veuillez réessayer plus tard. Vous pouvez également recevoir le récapitulatif par SMS."
          }}
        </p>
      </div>
      <div
        v-if="recapPhoneState === 'ok' && recapEmailState === 'ok'"
        class="fr-alert fr-alert--success"
      >
        <h3 class="fr-alert__title">Succès de l'envoi</h3>
        <p>Un récapitulatif vous a été envoyé par email et par SMS.</p>
      </div>
      <div
        v-else-if="recapPhoneState === 'ok' && recapEmailState != 'ok'"
        class="fr-alert fr-alert--success"
      >
        <h3 class="fr-alert__title">Succès de l'envoi</h3>
        <p>Un récapitulatif vous a été envoyé par SMS.</p>
      </div>
      <div
        v-else-if="recapEmailState === 'ok' && recapPhoneState != 'ok'"
        class="fr-alert fr-alert--success"
      >
        <h3 class="fr-alert__title">Succès de l'envoi</h3>
        <p>Un récapitulatif vous a été envoyé par email.</p>
      </div>
    </div>
    <div v-if="recapPhoneState === 'waiting' || recapEmailState === 'waiting'">
      <p
        ><span
          class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-2w">Envoi en cours…</span></p
      >
    </div>
  </div>
</template>
