<template>
  <div>
    <h2 class="fr-text--lead">En savoir plus</h2>
    <div v-html="text"></div>
    <p class="fr-my-2w">
      Toutes les réponses aux questions les plus fréquentes sont disponibles
      dans
      <router-link to="/faq">la foire aux questions</router-link>.
    </p>

    <BackButton
      size="small"
      data-testid="en-savoir-plus-back-button"
      class="fr-mt-2w"
      >Retour</BackButton
    >
  </div>
</template>

<script lang="ts">
import Hint from "@/lib/hint.js"
import BackButton from "@/components/buttons/back-button.vue"

export default {
  name: "EnSavoirPlusContent",
  components: {
    BackButton,
  },
  data() {
    return {
      open: false,
      window,
    }
  },
  computed: {
    attribute: function () {
      return this.source[this.source.length - 1]
    },
    source: function () {
      return this.$route.params.parent
    },
    text: function () {
      return Hint.get(this.attribute, this.source)
    },
  },
  mounted() {
    this.open = true
  },
}
</script>
