<script setup lang="ts">
import HeroSection from "@/components/mes-aides.org/hero-section.vue"
import { useIframeStore } from "@/stores/iframe.js"
import { computed } from "vue"

const iframeStore = useIframeStore()

const isIframe = computed(() => iframeStore.inIframe)
</script>

<template>
  <div data-testid="home-page">
    <HeroSection />
    <span v-if="!isIframe"> </span>
  </div>
</template>
