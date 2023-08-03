<template>
  <div>
    <h2 class="fr-text--lead">En savoir plus</h2>
    <p>{{ text }}</p>
    <BackButton size="small" @click="window?.history.back()">
      Retour
    </BackButton>
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
