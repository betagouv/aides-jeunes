<template>
  <div @mouseover="trackInterest()">
    <router-link
      :to="{ path: $route.path + '/en_savoir_plus' }"
      :data-text="text"
      class="aj-help-popup aj-tooltip a-unstyled"
    >
      <svg
        class="aj-help-icon"
        fill="#FFFFFF"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        width="20px"
        height="20px"
      >
        <path
          d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"
        />
      </svg>
      <span>en savoir plus</span>
    </router-link>
  </div>
</template>

<script>
import Hint from "@/lib/hint"

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
