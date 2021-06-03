<template>
  <div class="inline-block" @mouseover="trackInterest()">
    <router-link
      :to="{ path: $route.path + '/en_savoir_plus' }"
      :data-text="text"
      class="aj-help-popup aj-tooltip a-unstyled"
    >
      <div class="aj-help-icon">i</div>
      en savoir plus
    </router-link>
  </div>
</template>

<script>
import Hint from "@/lib/Hint"

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
      this.$matomo &&
        this.$matomo.trackEvent("Parcours", "En savoir plus", this.$route.path)
    },
  },
}
</script>
