<script setup lang="ts">
import HeroSection from "@/components/home/hero-section.vue"
import FeaturesSection from "@/components/home/features-section.vue"
import HowItWorksSection from "@/components/home/how-it-works-section.vue"
import BenefitsShowcaseSection from "@/components/home/benefits-showcase-section.vue"
import PartnersSection from "@/components/home/partners-section.vue"
import FaqSection from "@/views/faq.vue"
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <div data-testid="home-page">
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <BenefitsShowcaseSection />
    <PartnersSection />
    <FaqSection :showBackButton="false" />
  </div>
</template>
