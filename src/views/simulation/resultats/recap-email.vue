<script setup lang="ts">
import axios from "axios"
import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.js"
import { computed, ref } from "vue"
import BackButton from "@/components/buttons/back-button.vue"
import { useRouter } from "vue-router"
import StatisticsMixin from "@/mixins/statistics.js"

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

const goBack = () => {
  router.push({ path: "/simulation/resultats" })
}

const getRecap = async (surveyOptin) => {
  try {
    store.setRecapEmailState("waiting")
    if (emailRef.value && !emailRef.value.checkValidity()) {
      errorMessage.value = true
      emailRef.value.focus()
      StatisticsMixin.methods.sendEventToMatomo(
        "General",
        "Invalid form",
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
  } catch (error) {
    store.setRecapEmailState("error")
  }
}
</script>

<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <BackButton
        class="fr-btn--secondary fr-btn--sm fr-mb-2w"
        data-testid="back-button"
        @click="goBack"
        >Retour aux résultats</BackButton
      >
      <div class="">
        <h1 id="fr-modal-email-title" class="fr-modal__title"
          >Recevoir un récapitulatif par email</h1
        >
        <p>
          Si vous le souhaitez nous pouvons vous recontacter à deux reprises
          pour faire le point sur les démarches que vous avez faites et les
          blocages que vous avez rencontrés.
        </p>

        <div
          v-if="recapEmailState === 'error'"
          class="fr-alert fr-alert--error"
        >
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
        <form class="fr-form fr-my-2w" @submit.prevent="getRecap(true)">
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
              @click.prevent="getRecap(true)"
            >
              J'accepte d'être recontacté ou recontactée par email
            </button>
          </li>
          <li>
            <button
              :disabled="recapEmailState === 'waiting'"
              class="fr-btn fr-btn--secondary"
              @click.prevent="getRecap(false)"
            >
              Non merci, je préfère ne recevoir que le récapitulatif
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script></script>
