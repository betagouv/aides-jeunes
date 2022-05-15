<template>
  <div id="homepage">
    <div class="container">
      <div class="aj-home-hero">
        <div class="aj-home-hero-content">
          <h1>
            <span class="hightlight"
              >Évaluez vos droits à<br />{{ benefitsNumber }} aides
            </span>
            <br />en moins de 5 minutes.
          </h1>
          <div class="aj-home-disclaimer"
            >Avant de démarrer la simulation de vos aides, pensez à vous munir
            de vos ressources et de celles de vos parents si vous êtes encore à
            leur charge.</div
          >
          <div class="aj-home-hero-buttons-wrapper">
            <button
              v-if="hasExistingSituation"
              v-analytics="{
                action: 'Reprendre ma simulation',
                category: 'Home',
              }"
              :class="`button ${ctaSize} secondary`"
              @click="next()"
            >
              Reprendre ma simulation
            </button>
            <button
              v-analytics="{ action: ctaLabel, category: 'Home' }"
              :class="`button ${ctaSize} primary`"
              data-testid="new-simulation"
              @click="newSituation()"
            >
              {{ ctaLabel }}
            </button>
          </div>
        </div>
      </div>
      <div class="aj-home-illustration">
        <div>
          <img
            src="@/assets/images/home_illustration.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  computed: {
    hasExistingSituation: function () {
      return this.$store.getters.passSanityCheck
    },
    ctaLabel: function () {
      return this.hasExistingSituation
        ? "Commencer une nouvelle simulation"
        : "Je commence"
    },
    ctaSize: function () {
      return this.hasExistingSituation ? "large" : "xlarge"
    },
    benefitsNumber: function () {
      return process.env.VUE_APP_BENEFIT_COUNT
        ? process.env.VUE_APP_BENEFIT_COUNT
        : "plus de 400"
    },
  },
  methods: {
    newSituation: function () {
      this.$store.dispatch("clear", this.$route.query.external_id)
      this.next()
    },
    next: function () {
      this.$store.dispatch("openFiscaParameters")
      this.$store.dispatch("verifyBenefitVariables")
      this.$push()
    },
  },
}
</script>
