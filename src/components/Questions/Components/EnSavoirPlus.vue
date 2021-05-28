<template>
  <div class="inline-block" @mouseover="trackInterest()">
    <router-link
      :to="{
        name: 'en_savoir_plus_question',
        params: { step, questionIndex },
      }"
      :data-text="text"
      class="aj-help-popup aj-tooltip a-unstyled"
    >
      <div class="aj-help-icon">i</div>
      en savoir plus
    </router-link>
  </div>
</template>

<script>
export default {
  name: "EnSavoirPlus",
  props: {
    questionLabel: {
      type: String,
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    step: function () {
      return this.$route.params.step
    },
  },
  methods: {
    trackInterest() {
      this.$matomo &&
        this.$matomo.trackEvent(
          "Parcours",
          "En savoir plus",
          `${this.step}: ${this.questionLabel}`
        )
    },
  },
}
</script>
