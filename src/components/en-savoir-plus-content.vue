<template>
  <div>
    <h2 class="fr-text--lead">En savoir plus</h2>
    <p v-html="text"></p>
    <BackButton size="small" data-testid="en-savoir-plus-back-button"
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
