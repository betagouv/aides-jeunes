<template>
  <div v-if="show" class="modal__backdrop" @click.self.prevent="hide">
    <div class="modal">
      <span
        v-analytics="{ action: 'Fermé bouton', category: 'Email' }"
        class="aj-modal-close"
        @click="hide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
          />
        </svg>
      </span>
      <h2 class="aj-question"> Recevoir un récapitulatif par email </h2>
      <p>
        Si vous le souhaitez nous pouvons vous recontacter à deux reprises pour
        faire le point sur les démarches que vous avez faites et les blocages
        que vous avez rencontrés.
      </p>
      <div v-if="recapEmailState === 'ok'">
        <i class="fa fa-check" />
        On vous envoie un email&nbsp;!
      </div>

      <div v-if="recapEmailState === 'error'">
        <i class="fa fa-exclamation-triangle" />
        Une erreur s'est produite
      </div>

      <div v-if="recapEmailState === 'waiting'">
        <i class="fa fa-spinner fa-spin" aria-hidden="true" />
      </div>

      <form v-if="recapEmailState === 'show'" ref="form">
        <label for="email" class="form__group">Votre email</label>
        <input id="email" v-model="email" type="email" name="email" required />
        <WarningMessage v-if="errorMessage"
          >Une adresse email valide doit être indiquée.</WarningMessage
        >
        <div class="aj-feedback-buttons">
          <button
            type="submit"
            class="button outline text-center"
            @click.prevent="getRecap(true)"
          >
            J'accepte d'être recontacté·e par email
          </button>
          <button
            type="submit"
            class="button outline red text-center"
            @click.prevent="getRecap(false)"
          >
            Non merci, je préfère ne recevoir que le récapitulatif
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios"

import WarningMessage from "@/components/warning-message.vue"

export default {
  name: "RecapEmailModal",
  components: {
    WarningMessage,
  },
  props: {
    id: String,
  },
  data: function () {
    return {
      email: undefined,
      errorMessage: undefined,
    }
  },
  computed: {
    recapEmailState() {
      return this.$store.state.recapEmailState
    },
    show() {
      return ![undefined, "ok"].includes(this.recapEmailState)
    },
  },
  methods: {
    hide: function () {
      this.$store.commit("setRecapEmailState", undefined)
    },
    getRecap: function (surveyOptin) {
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

      const uri = `api/simulation/${this.id}/followup`
      const payload = {
        email: this.email,
        surveyOptin,
      }

      this.$store.commit("setRecapEmailState", "waiting")
      return axios
        .post(uri, payload)
        .then(() => {
          this.$store.commit("setRecapEmailState", "ok")
        })
        .catch(() => {
          this.$store.commit("setRecapEmailState", "error")
        })
    },
  },
}
</script>

<style scoped lang="scss">
.modal__backdrop {
  display: flex;
  align-items: flex-start;
  padding: 4em;
}
</style>
