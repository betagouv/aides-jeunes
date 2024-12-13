<script setup lang="ts">
import HeroSection from "@/components/home/hero-section.vue"
import FeaturesSection from "@/components/home/features-section.vue"
import HowItWorksSection from "@/components/home/how-it-works-section.vue"
import BenefitsShowcaseSection from "@/components/home/benefits-showcase-section.vue"
import PartnersSection from "@/components/home/partners-section.vue"
import FaqSection from "@/views/faq.vue"
</script>

<template>
  <div data-testid="home-page">
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <BenefitsShowcaseSection />
    <PartnersSection />
    <FaqSection :showBackButton="false" />

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
  </div>
</template>
