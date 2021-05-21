<template>
  <div id="error" class="alert alert-danger" role="alert">
    <h2
      ><i class="fa fa-warning" aria-hidden="true"></i> Une erreur est
      survenue.</h2
    >

    <div v-if="isTimeoutError" class="notification warning">
      <p
        >Vous êtes beaucoup à utiliser ce simulateur en ce moment. On n'a pas
        réussi à répondre à tout le monde en même temps.</p
      >

      <p
        >En actualisant la page vous pourrez obtenir les résultats de votre
        simulation. Si vous le pouvez, attendez quelques minutes pour le
        faire.</p
      >
    </div>

    <p
      ><a
        v-analytics="{ action: 'Support', category: 'Contact' }"
        v-mail="{
          subject: `[${resultatsId}] Problème technique`,
          body: `Bonjour,

  J'ai tenté de XXX,
  Et en cliquant sur XXX,
  J'ai rencontré l'erreur ci-dessous.

  Je vous joins également une capture d'écran pour faciliter la compréhension du problème.

  ————
  ID : ${resultatsId}
  Erreur : ${errorText}
  ————`,
        }"
        >Signalez ce problème</a
      >
      en décrivant ce que vous faisiez avant que cette erreur n'apparaisse, et
      en joignant si possible une capture d'écran. Nous vous répondrons au plus
      vite et corrigerons le problème dès que possible.</p
    >

    <p
      >Pour ne pas perdre les données que vous avez déclarées, vous pouvez
      garder cet onglet ouvert, puis actualiser la page une fois que le problème
      sera résolu.</p
    >

    <div>
      <button v-on:click="showDetails = !showDetails">
        Afficher les détails techniques
      </button>
    </div>
    <small v-if="showDetails">
      Informations techniques :
      <pre v-html="errorText"></pre>
    </small>
  </div>
</template>

<script>
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
      return this.errorText && this.errorText.match(/toObject/) //(/time.?out/i)
    },
    resultats: function () {
      return this.$store.state.calculs.resultats
    },
    resultatsId: function () {
      return (this.resultats && this.resultats._id) || "???"
    },
  },
}
</script>
