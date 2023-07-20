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

const recapPhoneState = computed(() => store.recapPhoneState)
const recapEmailState = computed(() => store.recapEmailState)
const emailFilled = computed(() => emailValue.value?.length ?? 0 > 0)
const phoneFilled = computed(() => phoneValue.value?.length ?? 0 > 0)
const emailAndPhoneFilled = computed(
  () => emailFilled.value && phoneFilled.value
)

const simulationId = computed(
  () => !store.calculs.dirty && store.calculs.resultats?._id
)

const regexAndPhoneTypeIsValid = () => {
  const regex = new RegExp("^(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}$")
  return (
    phoneValue.value &&
    regex.test(phoneValue.value) &&
    phoneRef.value?.checkValidity()
  )
}

const sendRecap = async (surveyOptin) => {
  try {
    if (emailAndPhoneFilled.value) {
      sendRecapByEmailAndSms(surveyOptin)
    } else if (emailFilled.value && !phoneFilled.value) {
      sendRecapByEmail(surveyOptin)
      phoneInputErrorMessage.value = false
      store.setFormRecapPhoneState(undefined)
    } else if (!emailFilled.value && phoneFilled.value) {
      sendRecapBySms(surveyOptin)
      emailInputErrorMessage.value = false
      store.setFormRecapEmailState(undefined)
    } else {
      store.setFormRecapState(undefined)
      phoneInputErrorMessage.value = true
      emailInputErrorMessage.value = true
    }
  } catch (error) {
    store.setFormRecapState("error")
  }
}

const inputPhoneIsValid = () => {
  if (phoneRef.value && !regexAndPhoneTypeIsValid()) {
    phoneInputErrorMessage.value = true
    phoneRef.value.focus()
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategories.GENERAL,
      "Invalid phone form",
      router.currentRoute.value.fullPath
    )
    return false
  }
  phoneInputErrorMessage.value = false
  return true
}

const inputEmailIsValid = () => {
  if (emailRef.value && !emailRef.value.checkValidity()) {
    emailInputErrorMessage.value = true
    emailRef.value.focus()
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategories.GENERAL,
      "Invalid email form",
      router.currentRoute.value.fullPath
    )
    return false
  }
  emailInputErrorMessage.value = false
  return true
}

const postFollowup = async (surveyOptin, email?, phone?) => {
  const uri = `/api/simulation/${simulationId.value}/followup`
  const payload = {
    surveyOptin,
    phone,
    email,
  }
  await axios.post(uri, payload)
}

const sendRecapByEmailAndSms = async (surveyOptin) => {
  store.setFormRecapState("waiting")
  if (!inputEmailIsValid() || !inputPhoneIsValid()) {
    store.setFormRecapState(undefined)
    throw new Error("Invalid email or phone number")
  }
  postFollowup(surveyOptin, emailValue.value, phoneValue.value)
  store.setFormRecapState("ok")
  phoneValue.value = undefined
  emailValue.value = undefined
}

const sendRecapBySms = async (surveyOptin) => {
  store.setFormRecapPhoneState("waiting")
  if (!inputPhoneIsValid()) {
    store.setFormRecapPhoneState(undefined)
    throw new Error("Invalid phone number")
  }
  try {
  postFollowup(surveyOptin, undefined, phoneValue.value)
  } catch (error) {
    console.error(error)
    store.setFormRecapPhoneState("error")
    throw new Error("Error while sending recap (sms)")
  }
  store.setFormRecapPhoneState("ok")
  phoneValue.value = undefined
  StatisticsMixin.methods.sendEventToMatomo(
    EventCategories.FOLLOWUP,
    "Formulaire validé",
    ABTestingService.getValues().recap_sms_form
  )
}

const sendRecapByEmail = async (surveyOptin) => {
  store.setFormRecapEmailState("waiting")
  if (!inputEmailIsValid()) {
    store.setFormRecapEmailState(undefined)
    throw new Error("invalid email")
  }
  try {
    postFollowup(surveyOptin, emailValue.value)
  } catch (error) {
    console.error(error)
    store.setFormRecapEmailState("error")
    throw new Error("Error while sending recap (email)")
  }
  store.setFormRecapEmailState("ok")
  emailValue.value = undefined
  StatisticsMixin.methods.sendEventToMatomo(
    EventCategories.FOLLOWUP,
    "Formulaire validé",
    ABTestingService.getValues().recap_sms_form
  )
}
</script>

<template>
  <div>
    <div v-if="recapPhoneState === 'error'" class="fr-alert fr-alert--error">
      <p>Une erreur s'est produite dans l'envoi par SMS</p>
    </div>
    <div v-if="recapEmailState === 'error'" class="fr-alert fr-alert--error">
      <p>Une erreur s'est produite dans l'envoi par l'email</p>
    </div>
    <div
      v-if="recapPhoneState === 'ok' && recapEmailState === 'ok'"
      class="fr-alert fr-alert--success"
    >
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par email et par SMS</p>
    </div>
    <div
      v-else-if="recapPhoneState === 'ok' && recapEmailState != 'ok'"
      class="fr-alert fr-alert--success"
    >
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par SMS</p>
    </div>
    <div
      v-else-if="recapEmailState === 'ok' && recapPhoneState != 'ok'"
      class="fr-alert fr-alert--success"
    >
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par email</p>
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
          >Votre numéro de téléphone portable
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
          :disabled="recapPhoneState === 'waiting'"
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
          :disabled="recapPhoneState === 'waiting'"
          class="fr-btn"
          @click.prevent="sendRecap(true)"
        >
          J'accepte d'être recontacté.e
        </button>
      </li>
      <li>
        <button
          :disabled="recapPhoneState === 'waiting'"
          class="fr-btn fr-btn--secondary"
          @click.prevent="sendRecap(false)"
        >
          Je souhaite juste le récapitulatif
        </button>
      </li>
    </ul>
  </div>
</template>
