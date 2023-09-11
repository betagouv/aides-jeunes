<script setup lang="ts">
import axios from "axios"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.js"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventCategory } from "@lib/enums/event-category.js"

const router = useRouter()
const store = useStore()
const phoneValue = ref<string>()
const phoneRef = ref<HTMLFormElement>()
const emailValue = ref(store.getFCUserInfoEmailValue)
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

const showSms = process.env.VITE_SHOW_SMS_TAB

const sendRecap = async (surveyOptin) => {
  try {
    if (emailAndPhoneFilled.value) {
      await sendRecapByEmailAndSms(surveyOptin)
      store.setModalState(undefined)
    } else if (emailFilled.value && !phoneFilled.value) {
      await sendRecapByEmail(surveyOptin)
      phoneInputErrorMessage.value = false
      store.setFormRecapPhoneState(undefined)
      store.setModalState(undefined)
    } else if (!emailFilled.value && phoneFilled.value) {
      await sendRecapBySms(surveyOptin)
      emailInputErrorMessage.value = false
      store.setFormRecapEmailState(undefined)
      store.setModalState(undefined)
    } else {
      store.setFormRecapState(undefined)
      phoneInputErrorMessage.value = true
      emailInputErrorMessage.value = true
    }
  } catch (error) {
    console.error(error)
  }
}

const inputPhoneIsValid = () => {
  if (phoneRef.value && !phoneRef.value?.checkValidity()) {
    phoneInputErrorMessage.value = true
    phoneRef.value.focus()
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategory.General,
      "Invalid phone form",
      router.currentRoute.value.fullPath
    )
    return false
  }
  phoneInputErrorMessage.value = false
  return true
}

const inputEmailIsValid = () => {
  if (emailRef.value && !emailRef.value?.checkValidity()) {
    emailInputErrorMessage.value = true
    emailRef.value.focus()
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategory.General,
      "Invalid email form",
      router.currentRoute.value.fullPath
    )
    return false
  }
  emailInputErrorMessage.value = false
  return true
}

const formatPhoneNumber = (phone) => {
  return phone?.replace(/\s/g, "")
}

const postFollowup = async (surveyOptin, email?, phone?) => {
  const uri = `/api/simulation/${simulationId.value}/followup`
  const payload = {
    surveyOptin,
    phone: formatPhoneNumber(phone),
    email,
  }
  return await axios.post(uri, payload)
}

const sendRecapByEmailAndSms = async (surveyOptin) => {
  store.setFormRecapState("waiting")
  if (!inputEmailIsValid() || !inputPhoneIsValid()) {
    store.setFormRecapState(undefined)
    throw new Error("Invalid email or phone number")
  }
  try {
    store.setModalState(undefined)
    await postFollowup(surveyOptin, emailValue.value, phoneValue.value)
  } catch (error) {
    console.error(error)
    store.setFormRecapState("error")
    throw new Error("Error while sending recap (email and sms)")
  }
  store.setFormRecapState("ok")
  phoneValue.value = undefined
  emailValue.value = undefined
}

const sendRecapBySms = async (surveyOptin) => {
  store.setFormRecapPhoneState("waiting")
  store.setFormRecapEmailState(undefined)
  if (!inputPhoneIsValid()) {
    store.setFormRecapPhoneState(undefined)
    throw new Error("Invalid phone number")
  }
  try {
    store.setModalState(undefined)
    await postFollowup(surveyOptin, undefined, phoneValue.value)
  } catch (error) {
    console.error(error)
    store.setFormRecapPhoneState("error")
    throw new Error("Error while sending recap (sms)")
  }
  store.setFormRecapPhoneState("ok")
  phoneValue.value = undefined
}

const sendRecapByEmail = async (surveyOptin) => {
  store.setFormRecapEmailState("waiting")
  store.setFormRecapPhoneState(undefined)
  if (!inputEmailIsValid()) {
    store.setFormRecapEmailState(undefined)
    throw new Error("invalid email")
  }
  try {
    store.setModalState(undefined)
    await postFollowup(surveyOptin, emailValue.value)
  } catch (error) {
    console.error(error)
    store.setFormRecapEmailState("error")
    throw new Error("Error while sending recap (email)")
  }
  store.setFormRecapEmailState("ok")
  emailValue.value = undefined
}
</script>

<template>
  <div class="fr-modal__content">
    <p>
      Si vous le souhaitez nous pouvons vous recontacter à deux reprises pour
      faire le point sur les démarches que vous avez faites et les blocages que
      vous avez rencontrés.
    </p>
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
    <form
      v-if="showSms"
      class="fr-form fr-my-2w"
      @submit.prevent="sendRecap(true)"
    >
      <div class="fr-form-group">
        <label class="fr-label" for="phone"
          >Votre numéro de téléphone portable
          <span class="fr-hint-text">Format attendu : 06 12 23 42 78</span>
        </label>
        <input
          id="phone"
          ref="phoneRef"
          v-model="phoneValue"
          pattern="((\+?(00|33))|(0))\s*[1-9]([\s\.\-]?\d{2}){4}"
          name="phone"
          required
          :aria-invalid="phoneInputErrorMessage"
          :aria-describedBy="
            phoneInputErrorMessage ? 'invalid-phone-warning' : null
          "
          type="tel"
          class="fr-input"
          autocomplete="tel"
          :disabled="recapPhoneState === 'waiting'"
        />
      </div>
      <WarningMessage
        v-if="phoneInputErrorMessage"
        id="invalid-phone-warning"
        class="fr-mt-2w"
        >Un numéro de téléphone valide doit être indiqué.
      </WarningMessage>
    </form>
  </div>
  <div class="fr-modal__footer">
    <ul class="fr-btns-group">
      <li>
        <button
          :disabled="recapPhoneState === 'waiting'"
          class="fr-btn"
          @click.prevent="sendRecap(true)"
        >
          J'accepte d'être recontacté ou recontactée
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
