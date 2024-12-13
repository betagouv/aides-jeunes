<template>
  <div data-testid="home-page">
    <HeroSection
      :benefits-number="benefitsNumber"
      :has-existing-situation="hasExistingSituation"
      :aide-domains="aideDomains"
      @next="next"
      @new-situation="newSituation"
    />
  </div>

  <FeaturesSection />
  <HowItWorksSection />
  <BenefitsShowcaseSection />
  <PartnersSection />

  <div class="fr-container fr-mt-4w fr-mb-8w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6 fr-text--center">
        <router-link
          to="/aides"
          class="fr-link fr-fi-arrow-right-line fr-link--icon-right"
          >Accéder à la liste complète des aides</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useStore } from "@/stores/index.js"
import { useRoute, useRouter } from "vue-router"
import HeroSection from "@/components/home/hero-section.vue"
import FeaturesSection from "@/components/home/features-section.vue"
import HowItWorksSection from "@/components/home/how-it-works-section.vue"
import BenefitsShowcaseSection from "@/components/home/benefits-showcase-section.vue"
import PartnersSection from "@/components/home/partners-section.vue"

const store = useStore()
const route = useRoute()
const router = useRouter()
const context = process.env.VITE_CONTEXT
const benefitsNumber = process.env.VITE_BENEFIT_COUNT

const hasExistingSituation = computed(() => store.passSanityCheck)

const aideDomains = ref([
  "Logement",
  "Santé",
  "Famille",
  "Transports",
  "Études",
  "Formation",
  "Travail",
  "Loisirs",
  "Vacances",
])

function newSituation() {
  store.clear(route.query.external_id as string)
  next()
}

function next() {
  store.setOpenFiscaParameters()
  if (context !== "production") {
    store.verifyBenefitVariables()
  }
  router.push({ name: "simulation" })
}
</script>
