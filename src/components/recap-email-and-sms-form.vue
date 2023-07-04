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
const phoneValue = ref<string>()
const phoneRef = ref<HTMLFormElement>()
const emailValue = ref<string>()
const emailRef = ref<HTMLFormElement>()
const emailInputErrorMessage = ref<boolean>()
const phoneInputErrorMessage = ref<boolean>()

const recapSmsState = computed(() => store.recapSmsState)
const recapEmailState = computed(() => store.recapEmailState)

const simulationId = computed(
  () => !store.calculs.dirty && store.calculs.resultats?._id
)

const checkPhoneValidity = () => {
  const regex = new RegExp("^(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}$")
  return (
    phoneValue.value &&
    regex.test(phoneValue.value) &&
    phoneRef.value?.checkValidity()
  )
}

const sendRecap = async (surveyOptin) => {
  if (emailValue.value && emailValue.value.length > 0) {
    sendRecapByEmail(surveyOptin)
  } else {
    emailInputErrorMessage.value = false
    store.setRecapEmailState(undefined)
  }
  if (phoneValue.value && phoneValue.value.length > 0) {
    sendRecapBySms(surveyOptin)
  } else {
    phoneInputErrorMessage.value = false
    store.setRecapSmsState(undefined)
  }
}
const sendRecapBySms = async (surveyOptin) => {
  try {
    store.setRecapSmsState("waiting")
    if (phoneRef.value && !checkPhoneValidity()) {
      phoneInputErrorMessage.value = true
      store.setRecapSmsState(undefined)
      phoneRef.value.focus()
      StatisticsMixin.methods.sendEventToMatomo(
        EventCategories.GENERAL,
        "Invalid phone form",
        router.currentRoute.value.fullPath
      )
      return
    }
    phoneInputErrorMessage.value = false

    const uri = `/api/simulation/${simulationId.value}/followup`
    const payload = {
      phone: phoneValue.value,
      surveyOptin,
    }
    await axios.post(uri, payload)
    store.setRecapSmsState("ok")
    phoneValue.value = undefined
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategories.FOLLOWUP,
      "Formulaire validé",
      ABTestingService.getValues().recap_sms_form
    )
  } catch (error) {
    store.setRecapSmsState("error")
  }
}

const sendRecapByEmail = async (surveyOptin) => {
  try {
    store.setRecapEmailState("waiting")
    if (emailRef.value && !emailRef.value.checkValidity()) {
      store.setRecapEmailState(undefined)
      emailInputErrorMessage.value = true
      emailRef.value.focus()
      StatisticsMixin.methods.sendEventToMatomo(
        EventCategories.GENERAL,
        "Invalid email form",
        router.currentRoute.value.fullPath
      )
      return
    }
    emailInputErrorMessage.value = false

    const uri = `/api/simulation/${simulationId.value}/followup`
    const payload = {
      email: emailValue.value,
      surveyOptin,
    }
    await axios.post(uri, payload)
    store.setRecapEmailState("ok")
    emailValue.value = undefined
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategories.FOLLOWUP,
      "Formulaire validé",
      ABTestingService.getValues().recap_sms_form
    )
  } catch (error) {
    store.setRecapEmailState("error")
  }
}
</script>

<template>
  <div>
    <div v-if="recapSmsState === 'error'" class="fr-alert fr-alert--error">
      <p>Une erreur s'est produite dans l'envoi par SMS</p>
    </div>
    <div v-if="recapEmailState === 'error'" class="fr-alert fr-alert--error">
      <p>Une erreur s'est produite dans l'envoi par l'email</p>
    </div>
    <div
      v-if="recapSmsState === 'ok' && recapEmailState === 'ok'"
      class="fr-alert fr-alert--success"
    >
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par email et par SMS</p>
    </div>
    <div
      v-else-if="recapSmsState === 'ok' && recapEmailState != 'ok'"
      class="fr-alert fr-alert--success"
    >
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par SMS</p>
    </div>
    <div
      v-else-if="recapEmailState === 'ok' && recapSmsState != 'ok'"
      class="fr-alert fr-alert--success"
    >
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par email</p>
    </div>
    <div v-if="recapSmsState === 'waiting' || recapEmailState === 'waiting'">
      <p
        ><span
          class="fr-icon--ml fr-icon-refresh-line fr-icon-spin"
          aria-hidden="true"
        ></span
        ><span class="fr-ml-2w">Envoi en cours…</span></p
      >
    </div>
    <form class="fr-form fr-my-2w" @submit.prevent="sendRecap(true)">
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
          :aria-invalid="emailInputErrorMessage"
          :aria-describedBy="
            emailInputErrorMessage ? 'invalid-email-warning' : null
          "
          type="email"
          class="fr-input"
          autocomplete="email"
          :disabled="recapEmailState === 'waiting'"
        />
      </div>
      <WarningMessage
        v-if="emailInputErrorMessage"
        id="invalid-email-warning"
        class="fr-mt-2w"
        >Une adresse email valide doit être indiquée.
      </WarningMessage>
    </form>
    <form class="fr-form fr-my-2w" @submit.prevent="sendRecap(true)">
      <div class="fr-form-group">
        <label class="fr-label" for="email"
          >Votre numéro de téléphone portable (facultatif)
          <span class="fr-hint-text">Format attendu : 06 12 23 42 78</span>
        </label>
        <input
          id="tel"
          ref="phoneRef"
          v-model="phoneValue"
          name="phone"
          required
          :aria-invalid="phoneInputErrorMessage"
          :aria-describedBy="
            phoneInputErrorMessage ? 'invalid-tel-warning' : null
          "
          type="tel"
          class="fr-input"
          autocomplete="tel"
          :disabled="recapSmsState === 'waiting'"
        />
      </div>
      <WarningMessage
        v-if="phoneInputErrorMessage"
        id="invalid-tel-warning"
        class="fr-mt-2w"
        >Un numéro de téléphone valide doit être indiqué.
      </WarningMessage>
    </form>
  </div>
  <div class="">
    <ul class="fr-btns-group">
      <li>
        <button
          :disabled="recapSmsState === 'waiting'"
          class="fr-btn"
          @click.prevent="sendRecap(true)"
        >
          J'accepte d'être recontacté.e
        </button>
      </li>
      <li>
        <button
          :disabled="recapSmsState === 'waiting'"
          class="fr-btn fr-btn--secondary"
          @click.prevent="sendRecap(false)"
        >
          Je souhaite juste le récapitulatif
        </button>
      </li>
    </ul>
  </div>
</template>
