<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col-12 fr-col-md-6 fr-mt-2w">
        <h1 class="fr-h3 fr-mb-3w">
          <span class="aj-hero-highlight">
            Évaluez vos droits à {{ benefitsNumber }} aides
          </span>
          en quelques clics.
        </h1>
        <p class="fr-text--lg fr-mb-2w">
          Découvrez rapidement toutes les aides financières auxquelles vous avez
          droit dans les domaines suivants :
        </p>
        <div class="aj-domains-container fr-mb-3w">
          <span
            v-for="(domain, index) in aideDomains"
            :key="`domain-${index}`"
            class="aj-domain"
          >
            {{ domain }}
          </span>
        </div>
        <p class="fr-text--sm fr-mb-4w">
          Avant de démarrer la simulation de vos aides, pensez à vous munir de
          vos ressources et de celles de vos parents si vous êtes encore à leur
          charge.
        </p>
        <div class="fr-btns-group fr-btns-group--inline-md">
          <button
            v-if="hasExistingSituation"
            v-analytics="{
              action: eventActionResume,
              category: eventCategoryHome,
            }"
            class="fr-btn fr-btn--secondary"
            @click="$emit('next')"
          >
            Reprendre ma simulation
          </button>
          <button
            v-analytics="{ action: ctaLabel, category: eventCategoryHome }"
            class="fr-btn fr-btn--lg"
            data-testid="new-simulation"
            @click="$emit('newSituation')"
          >
            {{ ctaLabel }}
          </button>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-hidden fr-unhidden-md fr-mt-2w">
        <img
          src="@/assets/images/home_illustration.png"
          class="aj-hero-image"
          alt="Illustration du simulateur d'aides"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { EventAction, EventCategory } from "@lib/enums/event.js"

const props = defineProps({
  benefitsNumber: {
    type: String,
    required: true,
  },
  hasExistingSituation: {
    type: Boolean,
    required: true,
  },
  aideDomains: {
    type: Array as () => string[],
    required: true,
  },
})

defineEmits(["next", "newSituation"])

const eventActionResume = EventAction.ReprendreMaSimulation
const eventCategoryHome = EventCategory.Home

const ctaLabel = computed(() =>
  props.hasExistingSituation
    ? "Commencer une nouvelle simulation"
    : "Je commence ma simulation"
)
</script>
