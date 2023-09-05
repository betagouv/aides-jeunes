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
              <button
                v-analytics="{ action: 'Fermé bouton', category: 'Email' }"
                class="fr-btn--close fr-btn"
                title="Fermer la fenêtre modale"
                aria-controls="fr-modal-email"
                @click="hide"
                >Fermer</button
              >
            </div>
            <div class="fr-modal__content">
              <h1 id="fr-modal-email-title" class="fr-modal__title"
                >Recevoir un récapitulatif par email</h1
              >
              <p>
                Si vous le souhaitez nous pouvons vous recontacter à deux
                reprises pour faire le point sur les démarches que vous avez
                faites et les blocages que vous avez rencontrés.
              </p>

              <div
                v-if="recapEmailState === 'error'"
                class="fr-alert fr-alert--error"
              >
                <p>Une erreur s'est produite</p>
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
              <form
                v-if="recapEmailState === 'show'"
                ref="form"
                class="fr-form"
                @submit.prevent="getRecap(true)"
              >
                <div class="fr-form-group">
                  <label class="fr-label" for="email"
                    >Votre email
                    <span class="fr-hint-text"
                      >Format attendu : nom@domaine.fr</span
                    >
                  </label>
                  <input
                    id="email"
                    ref="email"
                    v-model="email"
                    name="email"
                    required
                    :aria-invalid="errorMessage"
                    :aria-describedBy="
                      errorMessage ? 'invalid-email-warning' : null
                    "
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
            <div class="fr-modal__footer">
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
      </div>
    </div>
  </dialog>
</template>

<script lang="ts">
import axios from "axios"

import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores/index.js"
import StatisticsMixin from "@/mixins/statistics.js"
import { EventCategory } from "@lib/enums/event-category.js"

export default {
  name: "RecapEmailModal",
  components: {
    WarningMessage,
  },
  mixins: [StatisticsMixin],
  props: {
    id: String,
  },
  setup() {
    return {
      store: useStore(),
    }
  },
  data() {
    return {
      email: this.store.getFCUserInfoEmailValue,
      errorMessage: undefined,
    }
  },
  computed: {
    recapEmailState() {
      return this.store.recapEmailState
    },
  },
  methods: {
    hide() {
      this.store.setRecapEmailState(undefined)
    },
    getRecap(surveyOptin) {
      if (!this.$refs.form.checkValidity()) {
        this.errorMessage = true
        this.$refs.email.focus()
        this.sendEventToMatomo(
          EventCategory.General,
          "Invalid form",
          this.$route.fullPath
        )

        return
      }

      const uri = `/api/simulation/${this.id}/followup`
      const payload = {
        email: this.email,
        surveyOptin,
      }

      this.store.setRecapEmailState("waiting")
      return axios
        .post(uri, payload)
        .then(() => {
          this.store.setRecapEmailState("ok")
        })
        .catch(() => {
          this.store.setRecapEmailState("error")
        })
    },
  },
}
</script>
