<template>
  <div id="error" class="alert alert-danger" role="alert">
    <h2><i class="fa fa-warning" aria-hidden="true"></i> Une erreur est survenue.</h2>
    <p><a
      v-analytics="{ action:'Support', category:'Contact'}"
      v-mail="{subject:`[${resultatsId}] Problème technique`, body:`Bonjour,

  J'ai tenté de XXX,
  Et en cliquant sur XXX,
  J'ai rencontré l'erreur ci-dessous.

  Je vous joins également une capture d'écran pour faciliter la compréhension du problème.

  ————
  ID : ${ resultatsId }
  Erreur : ${ error }
  ————`}">Signalez ce problème</a> en décrivant ce que vous faisiez avant que cette erreur n'apparaisse, et en joignant si possible une capture d'écran. Nous vous répondrons au plus vite et corrigerons le problème dès que possible.</p>

    <p>Pour ne pas perdre les données que vous avez déclarées, vous pouvez garder cet onglet ouvert, puis actualiser la page une fois que le problème sera résolu.</p>

    <small>
      Informations techniques :
      <pre v-html="error"></pre>
    </small>
  </div>
</template>

<script>
export default {
  name: 'ErrorBlock',
  computed: {
    resultatStatus: function() { return this.$store.state.calculs },
    error: function() {
      let value = this.resultatStatus.error && this.resultatStatus.exception
      return (value instanceof String || value instanceof Error) ? value : JSON.stringify(value, null, 2)
    },
    resultats: function() { return this.$store.state.calculs.resultats },
    resultatsId: function() { return this.resultats && this.resultats._id || '???' },
  }
}
</script>
