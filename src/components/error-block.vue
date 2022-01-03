<template>
  <div id="error" class="alert alert-danger" role="alert">
    <h2>
      <i class="fa fa-warning" aria-hidden="true" /> Une erreur est survenue.
    </h2>

    <div v-if="isTimeoutError" class="notification warning">
      <p>
        Vous êtes beaucoup à utiliser ce simulateur en ce moment. On n'a pas
        réussi à répondre à tout le monde en même temps.
      </p>

      <p>
        En actualisant la page vous pourrez obtenir les résultats de votre
        simulation. Si vous le pouvez, attendez quelques minutes pour le faire.
      </p>
    </div>

    <p>
      <a
        v-analytics="{ action: 'Support', category: 'Contact' }"
        v-mail="sendErrorMail()"
        >Signalez ce problème</a
      >
      en décrivant ce que vous faisiez avant que cette erreur n'apparaisse, et
      en joignant si possible une capture d'écran. Nous vous répondrons au plus
      vite et corrigerons le problème dès que possible.
    </p>
    <p>
      Pour ne pas perdre les données que vous avez déclarées, vous pouvez garder
      cet onglet ouvert, puis actualiser la page une fois que le problème sera
      résolu.
    </p>
    <div>
      <button class="button" @click="showDetails = !showDetails">
        Afficher les détails techniques
      </button>
    </div>
    <pre v-html="errorText"></pre>
    <small v-if="showDetails">
      Informations techniques :
      <pre v-html="errorText" />
    </small>
  </div>
</template>

<script>
import { sendError } from "@/plugins/mails"

export default {
  name: "ErrorBlock",
  data: function () {
    return {
      showDetails: false,
    }
  },
  computed: {
    resultatStatus: function () {
      return this.$store.state.calculs
    },
    errorText: function () {
      let value = this.resultatStatus.error && this.resultatStatus.exception
      return value instanceof String || value instanceof Error
        ? value
        : JSON.stringify(value, null, 2)
    },
    isTimeoutError: function () {
      return (
        this.errorText instanceof String && this.errorText.match(/time.?out/i)
      )
    },
    resultats: function () {
      return this.$store.state.calculs.resultats
    },
  },
  methods: {
    sendErrorMail() {
      return sendError(this.$store.state.situationId, this.errorText)
    },
  },
}
</script>
