<template>
  <div class="inline-block" @mouseover="trackInterest()" @click="onClick()">
    <div :text="text" class="aj-help-popup aj-tooltip a-unstyled">
      <div class="aj-help-icon">i</div>
      en savoir plus
    </div>
  </div>
</template>

<script>
export default {
  name: "EnSavoirPlus",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    trackInterest() {
      this.$matomo &&
        this.$matomo.trackEvent("Parcours", "En savoir plus", this.text)
    },
    onClick() {
      // TODO show modal instead of alert
      alert(this.text)
    },
  },
}
</script>
