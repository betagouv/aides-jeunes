<template>
  <div id="error" class="alert alert-danger" role="alert">
    <h2>
      <i aria-hidden="true" class="ri ri-error-warning-fill" /> Une erreur est
      survenue.
    </h2>
    <p>
      <a
        v-analytics="{ action: 'Support', category: 'Contact' }"
        v-mail="{
          subject: `[Erreur Back] Problème technique`,
          body: `Bonjour,
  J'ai tenté de XXX,
  Et en cliquant sur XXX,
  J'ai rencontré l'erreur ci-dessous.
  Je vous joins également une capture d'écran pour faciliter la compréhension du problème.
  ————
  Erreur : ${error}
  ————`,
        }"
        >Signalez ce problème</a
      >
      en décrivant ce que vous faisiez avant que cette erreur n'apparaisse, et
      en joignant si possible une capture d'écran. Nous vous répondrons au plus
      vite et corrigerons le problème dès que possible.
    </p>

    <p>Nous nous excusons pour la gène occasionée... </p>

    <small>
      Informations techniques :
      <pre v-html="error" />
    </small>
  </div>
</template>

<script>
import { useStore } from "@/stores"

export default {
  name: "ErrorSaveBlock",
  setup() {
    return {
      store: useStore(),
    }
  },
  computed: {
    error() {
      let value = this.store.saveSituationError
      return value instanceof String || value instanceof Error
        ? value
        : JSON.stringify(value, null, 2)
    },
  },
}
</script>
