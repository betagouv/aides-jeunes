<template>
  <div
    v-if="!submitResult.ok"
    class="aj-offline-results"
  >
    <h2 class="aj-question">
      Je garde ces informations&nbsp;!
    </h2>
    <span>
      Vous pouvez enregistrer les résultats de votre simulation pour les
      consulter plus tard.
    </span>

    <Modal
      tag="span"
      analytics-category="Email"
    >
      <template #message>
        <div class="aj-offline-results-button">
          <button
            type="button"
            class="button primary text-center"
            @click="reset"
          >
            <i
              class="fa fa-envelope-o"
              aria-hidden="true"
            />
            Recevoir par email
          </button>
        </div>
      </template>
      <h2 class="aj-question">
        Recevoir un récapitulatif par email
      </h2>
      <p>
        Si vous le souhaitez nous pouvons vous recontacter à deux reprises pour
        faire le point sur les démarches que vous avez faites et les blocages
        que vous avez rencontrés.
      </p>
      <div v-if="submitResult && submitResult.ok">
        <i class="fa fa-check" />
        On vous envoie un email&nbsp;!
      </div>

      <div v-if="submitResult && submitResult.error">
        <i class="fa fa-exclamation-triangle" />
        Une erreur s'est produite
      </div>

      <div v-if="submitResult && submitResult.waiting">
        <i
          class="fa fa-spinner fa-spin"
          aria-hidden="true"
        />
      </div>

      <form
        v-if="
          submitResult &&
            !(submitResult.ok || submitResult.waiting || submitResult.error)
        "
      >
        <label
          for="email"
          class="form__group"
        >Votre email</label>
        <input
          id="email"
          v-model="email"
          type="text"
          name="email"
        >
        <p
          v-if="$v.email.$error"
          class="notification warning"
        >
          Un email doit être indiqué.
        </p>
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
    </Modal>
  </div>
</template>

<script>
import axios from "axios"
import { required, email } from '@vuelidate/validators'

import Modal from "@/components/Modal"

export default {
  name: "OfflineResults",
  components: {
    Modal,
  },
  props: {
    id: String,
  },
  data: function () {
    return {
      email: undefined,
      submitResult: {
        ok: undefined,
        waiting: undefined,
        error: undefined,
      },
    }
  },
  methods: {
    reset: function () {
      this.submitResult = {
        ok: undefined,
        waiting: undefined,
        error: undefined,
      }
    },
    getRecap: function (surveyOptin) {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$matomo &&
          this.$matomo.trackEvent(
            "General",
            "Invalid form",
            this.$route.fullPath
          )
        return
      }

      const uri = `api/answers/${this.id}/followup`
      const payload = {
        email: this.email,
        surveyOptin,
      }

      this.submitResult.ok = false
      this.submitResult.error = false
      this.submitResult.waiting = true
      return axios
        .post(uri, payload)
        .then(() => {
          this.submitResult.ok = true
        })
        .catch(() => {
          this.submitResult.error = true
        })
        .finally(() => {
          this.submitResult.waiting = false
        })
    },
  },
  validations: {
    email: { required, email },
  },
}
</script>
