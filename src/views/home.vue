<template>
  <main id="homepage" role="main">
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
            <template v-if="hasSituationCredentials">
              <button
                :class="`button ${ctaSize} secondary`"
                @click="startPrefilledSimulation()"
              >
                Accéder à ma simulation pré-remplie
              </button>

              <button
                v-if="returnUrl"
                :class="`button ${ctaSize} secondary`"
                @click="browseToReturnUrl()"
              >
                {{ returnUrl.label }}
              </button>
            </template>
            <template v-else>
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
            </template>
          </div>
        </div>
      </div>
      <div class="aj-home-illustration">
        <div>
          <img src="@/assets/images/home_illustration.png" alt="" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { setSituationCredentials } from "@/lib/cookies"
import { redirect } from "@/lib/redirect"

export default {
  name: "Home",
  mounted: function () {
    if (this.hasSituationCredentials) {
      setSituationCredentials(
        this.$cookies,
        this.$route.query.situationId,
        this.$route.query.token
      )

      this.$store.dispatch("fetch", this.$route.query.situationId)
    }
  },
  computed: {
    hasExistingSituation: function () {
      return this.$store.getters.passSanityCheck
    },
    hasSituationCredentials: function () {
      return (
        this.$route.query &&
        this.$route.query.situationId &&
        this.$route.query.token
      )
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
    returnUrl() {
      return this.$store.getters.thirdPartyData?.returnUrl
    },
  },
  methods: {
    newSituation: function () {
      this.$store.dispatch("clear", this.$route.query.external_id)
      this.next()
    },
    startPrefilledSimulation: function () {
      this.next()
    },
    next: function () {
      this.$store.dispatch("openFiscaParameters")
      this.$store.dispatch("verifyBenefitVariables")
      this.$push()
    },
    browseToReturnUrl() {
      redirect(this.returnUrl.url)
    },
  },
}
</script>
