<template>
  <div class="fr-container fr-mt-8w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12">
        <h3 class="fr-h3 fr-mb-4w">Comment ça marche ?</h3>
        <div class="aj-home-steps">
          <div
            v-for="(step, index) in steps"
            :key="`steps-${index}`"
            class="aj-home-step"
          >
            <div class="aj-home-step__number">{{ index + 1 }}</div>
            <div>
              <h4 class="fr-text--lg fr-mb-2w">{{ step.title }}</h4>
              <p class="aj-home-step__description fr-text--sm fr-mb-0">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const steps = [
  {
    title: "Je commence une simulation",
    description: "5 minutes suffisent pour compléter une simulation",
  },
  {
    title: "Je découvre mes aides",
    description: "Visualisez immédiatement toutes les aides disponibles",
  },
  {
    title: "Je fais mes demandes",
    description: "Accédez directement aux démarches en ligne",
  },
  {
    title: "Je suis accompagné",
    description: "Un conseiller peut vous aider gratuitement si besoin",
  },
]
</script>
