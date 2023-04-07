<template>
  <span v-if="text" class="fr-ml-1v" @mouseover="trackInterest()">
    &nbsp;
    <router-link
      :to="{ path: $route.path + '/en_savoir_plus' }"
      :data-text="text"
      class="fr-badge fr-badge--info"
      >en savoir plus
    </router-link>
  </span>
</template>

<script>
import Hint from "@/lib/hint.ts"

export default {
  name: "EnSavoirPlus",
  computed: {
    attribute: function () {
      return this.$route.path.substring(this.$route.path.lastIndexOf("/") + 1)
    },
    source: function () {
      return this.$route.path
    },
    text: function () {
      return Hint.get(this.attribute, this.source)
    },
  },
  methods: {
    trackInterest() {
      this.$matomo?.trackEvent("Parcours", "En savoir plus", this.$route.path)
    },
  },
}
</script>
