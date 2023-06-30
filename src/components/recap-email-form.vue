<script setup lang="ts">
import axios from "axios"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.js"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventCategories } from "@lib/enums/event-categories.js"
import ABTestingService from "@/plugins/ab-testing-service.js"

const router = useRouter()
const store = useStore()
const emailValue = ref(store.getFCUserInfoEmailValue)
const emailRef = ref<HTMLFormElement>()
const errorMessage = ref<boolean>()

const recapEmailState = computed(() => {
  return store.recapEmailState
})

const simulationId = computed(() => {
  return !store.calculs.dirty && store.calculs.resultats?._id
})

const sendEmailRecap = async (surveyOptin) => {
  try {
    store.setRecapEmailState("waiting")
    if (emailRef.value && !emailRef.value.checkValidity()) {
      errorMessage.value = true
      emailRef.value.focus()
      StatisticsMixin.methods.sendEventToMatomo(
        EventCategories.GENERAL,
        "Invalid email form",
        router.currentRoute.value.fullPath
      )
      return
    }
    errorMessage.value = false

    const uri = `/api/simulation/${simulationId.value}/followup`
    const payload = {
      email: emailValue.value,
      surveyOptin,
    }
    await axios.post(uri, payload)
    store.setRecapEmailState("ok")
    emailValue.value = ""
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategories.FOLLOWUP,
      "Formulaire validé",
      ABTestingService.getValues().recap_email_form
    )
  } catch (error) {
    store.setRecapEmailState("error")
  }
}
</script>

<template>
  <div>
    <div v-if="recapEmailState === 'error'" class="fr-alert fr-alert--error">
      <p>Une erreur s'est produite</p>
    </div>
    <div v-if="recapEmailState === 'ok'" class="fr-alert fr-alert--success">
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par email</p>
    </div>
    <div v-if="recapEmailState === 'waiting'">
      <p
        ><span
          class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-2w">Envoi en cours…</span></p
      >
    </div>
    <form class="fr-form fr-my-2w" @submit.prevent="sendEmailRecap(true)">
      <div class="fr-form-group">
        <label class="fr-label" for="email"
          >Votre email
          <span class="fr-hint-text">Format attendu : nom@domaine.fr</span>
        </label>
        <input
          id="email"
          ref="emailRef"
          v-model="emailValue"
          name="email"
          required
          :aria-invalid="errorMessage"
          :aria-describedBy="errorMessage ? 'invalid-email-warning' : null"
          type="email"
          class="fr-input"
          autocomplete="email"
          :disabled="recapEmailState === 'waiting'"
        />
      </div>
      <WarningMessage
        v-if="errorMessage"
        id="invalid-email-warning"
        class="fr-mt-2w"
        >Une adresse email valide doit être indiquée.
      </WarningMessage>
    </form>
  </div>
  <div class="">
    <ul class="fr-btns-group">
      <li>
        <button
          :disabled="recapEmailState === 'waiting'"
          class="fr-btn"
          @click.prevent="sendEmailRecap(true)"
        >
          J'accepte d'être recontacté ou recontactée par email
        </button>
      </li>
      <li>
        <button
          :disabled="recapEmailState === 'waiting'"
          class="fr-btn fr-btn--secondary"
          @click.prevent="sendEmailRecap(false)"
        >
          Non merci, je préfère ne recevoir que le récapitulatif
        </button>
      </li>
    </ul>
  </div>
</template>
