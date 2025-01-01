<script setup lang="ts">
import HeroSection from "@/components/home/hero-section.vue"
import FeaturesSection from "@/components/home/features-section.vue"
import HowItWorksSection from "@/components/home/how-it-works-section.vue"
import BenefitsShowcaseSection from "@/components/home/benefits-showcase-section.vue"
import PartnersSection from "@/components/home/partners-section.vue"
import FaqSection from "@/views/faq.vue"
import { useIframeStore } from "@/stores/iframe.js"
import { computed } from "vue"

const iframeStore = useIframeStore()

const isIframe = computed(() => iframeStore.inIframe)
</script>

<template>
  <div data-testid="home-page">
    <HeroSection />
    <span v-if="!isIframe">
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsShowcaseSection />
      <PartnersSection />
      <FaqSection :show-back-button="false" />
    </span>
  </div>
</template>
