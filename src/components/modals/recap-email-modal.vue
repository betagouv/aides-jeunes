<template>
  <dialog
    v-if="show"
    aria-labelledby="fr-modal-email-title"
    role="dialog"
    id="fr-modal-email"
    class="fr-modal"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button
                v-analytics="{ action: 'Fermé bouton', category: 'Email' }"
                @click="hide"
                class="fr-btn--close fr-btn"
                title="Fermer la fenêtre modale"
                aria-controls="fr-modal-email"
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
              >
                <div class="fr-form-group">
                  <label class="fr-label" for="email">Votre email</label>
                  <input
                    id="email"
                    v-model="email"
                    name="email"
                    required
                    type="email"
                    class="fr-input"
                    autocomplete="email"
                  />
                </div>
                <WarningMessage v-if="errorMessage" class="fr-mt-2w"
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
                    @click.prevent="getRecap(false)"
                  >
                    J'accepte d'être recontacté·e par email
                  </button>
                </li>
                <li>
                  <button
                    :disabled="recapEmailState === 'waiting'"
                    class="fr-btn fr-btn--secondary"
                    @click.prevent="getRecap(true)"
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

<script>
import axios from "axios"

import WarningMessage from "@/components/warning-message.vue"
import { useStore } from "@/stores"

export default {
  name: "RecapEmailModal",
  components: {
    WarningMessage,
  },
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
      email: undefined,
      errorMessage: undefined,
    }
  },
  computed: {
    recapEmailState() {
      return this.store.recapEmailState
    },
    show() {
      return ![undefined, "ok"].includes(this.recapEmailState)
    },
  },
  methods: {
    hide() {
      this.store.setRecapEmailState(undefined)
    },
    getRecap(surveyOptin) {
      if (!this.$refs.form.checkValidity()) {
        this.errorMessage = true
        this.$matomo &&
          this.$matomo.trackEvent(
            "General",
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

<style lang="scss" scoped>
.modal__backdrop {
  display: flex;
  align-items: flex-start;
  padding: 4em;
  overflow-y: scroll;
}
</style>
