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
const phoneValue = ref<string>("")
const phoneRef = ref<HTMLFormElement>()
const errorMessage = ref<boolean>()

const recapSmsState = computed(() => {
  return store.recapSmsState
})

const simulationId = computed(() => {
  return !store.calculs.dirty && store.calculs.resultats?._id
})

const checkPhoneValidity = () => {
  const regex = new RegExp("^(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}$")
  return regex.test(phoneValue.value) && phoneRef.value?.checkValidity()
}

const sendEmailRecap = async (surveyOptin) => {
  try {
    if (phoneRef.value && !checkPhoneValidity()) {
      errorMessage.value = true
      store.setRecapSmsState(undefined)
      phoneRef.value.focus()
      StatisticsMixin.methods.sendEventToMatomo(
        EventCategories.GENERAL,
        "Invalid phone form",
        router.currentRoute.value.fullPath
      )
      return
    }
    errorMessage.value = false

    const uri = `/api/simulation/${simulationId.value}/followup`
    const payload = {
      phone: phoneValue.value,
      surveyOptin,
    }
    await axios.post(uri, payload)
    store.setRecapSmsState("ok")
    phoneValue.value = ""
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategories.FOLLOWUP,
      "Formulaire validé",
      ABTestingService.getValues().recap_sms_form
    )
  } catch (error) {
    store.setRecapSmsState("error")
  }
}
</script>

<template>
  <div>
    <div v-if="recapSmsState === 'error'" class="fr-alert fr-alert--error">
      <p>Une erreur s'est produite</p>
    </div>
    <div v-if="recapSmsState === 'ok'" class="fr-alert fr-alert--success">
      <h3 class="fr-alert__title">Succès de l'envoi</h3>
      <p>Un récapitulatif vous a été envoyé par SMS</p>
    </div>
    <div v-if="recapSmsState === 'waiting'">
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
          >Votre numéro de téléphone portable
          <span class="fr-hint-text">Format attendu : 06 00 00 00 00</span>
        </label>
        <input
          id="tel"
          ref="phoneRef"
          v-model="phoneValue"
          name="phone"
          required
          :aria-invalid="errorMessage"
          :aria-describedBy="errorMessage ? 'invalid-tel-warning' : null"
          type="tel"
          class="fr-input"
          autocomplete="tel"
          :disabled="recapSmsState === 'waiting'"
        />
      </div>
      <WarningMessage
        v-if="errorMessage"
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
          @click.prevent="sendEmailRecap(true)"
        >
          J'accepte d'être recontacté ou recontactée par SMS
        </button>
      </li>
      <li>
        <button
          :disabled="recapSmsState === 'waiting'"
          class="fr-btn fr-btn--secondary"
          @click.prevent="sendEmailRecap(false)"
        >
          Non merci, je préfère ne recevoir que le récapitulatif
        </button>
      </li>
    </ul>
  </div>
</template>
